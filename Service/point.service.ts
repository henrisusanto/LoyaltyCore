import { MemberRepositoryInterface } from '../RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../RepositoryInterface/pointtype.repositoryinterface'

import { PointEntity,  } from '../Entity/point.entity'
import { MemberEntity } from '../Entity/member.entity'
import { PointTypeEntity } from '../Entity/pointtype.entity'

export class PointService {
	protected MemberRepo: MemberRepositoryInterface
	protected PointRepo: PointRepositoryInterface
	protected PointTypeRepo: PointTypeRepositoryInterface

	constructor (MemberRepo: MemberRepositoryInterface, PointRepo: PointRepositoryInterface, PointTypeRepo: PointTypeRepositoryInterface) {
		this.MemberRepo = MemberRepo
		this.PointRepo = PointRepo
		this.PointTypeRepo = PointTypeRepo
	}

	public async save (Member: MemberEntity, Points: PointEntity []): Promise <number []> {
		var Deferred: Promise <number>[] = []
		Deferred.push (this.MemberRepo.save (Member))
		let Changed = Points.filter (point => {
			return point.HasChanges
		}).forEach (point => {
			Deferred.push (this.PointRepo.save (point))
		})
		return Promise.all (Deferred)
	}

	public async earn (data: { Member: number, RawAmount: number, ActivityCode: string, Reference: number, Parent?: number }): Promise <number []> {
		try {
			let { Member, RawAmount, ActivityCode, Reference, Parent } = data
			let Rate = await this.PointTypeRepo.findByCode (ActivityCode)

			let Point = new PointEntity ()
			Point.createPointEarning ({
				Member,
				RawAmount,
				Rate,
				Reference,
				Parent
			})

			let MemberEntity = await this.MemberRepo.findOne (Member)
			MemberEntity.submitPoint (Point)

			return await this.save (MemberEntity, [Point])
		} catch (e) {
			throw new Error (e)
		}
	}

	public async spend (data: { Member: number, RawAmount: number, ActivityCode: string, Reference: number }): Promise <number []> {
		try {
			let { Member, RawAmount, ActivityCode, Reference } = data
			let Rate = await this.PointTypeRepo.findByCode (ActivityCode)

			let PointUsage = new PointEntity ()
			PointUsage.createPointSpending ({
				Member,
				RawAmount,
				Rate,
				Reference
			})

			let MemberEntity = await this.MemberRepo.findOne (Member)
			MemberEntity.submitPoint (PointUsage)

			let PointRemains = await this.PointRepo.findPointToUse ({
				Member: `= ${Member}`,
				LifetimeRemaining: '> 0'
			})
			PointRemains.sort ((a, b) => {
				return a.getTime().getTime() - b.getTime().getTime()
			})

			await this.fifo (PointUsage, PointRemains)

			let Points = PointRemains
			Points.push (PointUsage)
			return await this.save (MemberEntity, Points)
		} catch (e) {
			throw new Error (e)
		}
	}

	private async fifo (usage: PointEntity, remains: PointEntity []): Promise <void[]> {
		try {
			var LTinIndex: number = 0
			let { Lifetime } = usage.getPointAmount ()
			let walkingUsage = Math.abs(Lifetime)
			var deferred: void[] = []
			while (walkingUsage > 0) {
				let pointUnit = remains[LTinIndex]
				let unitRemaining = pointUnit.getLifetimeRemaining ()
				if (walkingUsage > unitRemaining) {
					deferred.push (pointUnit.use (unitRemaining))
					walkingUsage -= unitRemaining
				} else {
					deferred.push (pointUnit.use (walkingUsage))
					walkingUsage = 0
				}
				LTinIndex++
			}
			return Promise.all(deferred)
		} catch (e) { 
			throw new Error (e)
		}
	}

	public async expire (Member: MemberEntity, Expireds: PointEntity [], Rate: PointTypeEntity): Promise <number[]> {
		try {
			var RawAmount: number = 0
			Expireds.forEach ( point => {
				RawAmount += point.getLifetimeRemaining ()
				point.use (point.getLifetimeRemaining ())
			})

			RawAmount *= -1

			let Usage = new PointEntity ()
			Usage.createPointExpirer ({
				Member: Member.getId (),
				RawAmount,
				Rate
			})

			Member.submitPoint (Usage)
			let Points = Expireds
			Points.push (Usage)

			return await this.save (Member, Points)
		} catch (e) {
			throw new Error (e)
		}
	}

	public async manual (data: {Member: MemberEntity, Rate: PointTypeEntity, ManualId: number, YTD: number, Lifetime: number, Time ?: Date, Remarks ?: string}): Promise <number []> {
		try {
			let { Member, Rate, ManualId, YTD, Lifetime, Time, Remarks } = data
			let Point = new PointEntity
			Point.createPointManual ({
				Member: Member.getId (),
				YTD,
				Lifetime,
				Rate,
				ManualId,
				Time,
				Remarks
			})
			Member.submitPoint (Point)

			let Points: PointEntity[] = []
			if (Lifetime < 0) {
				let PointRemains = await this.PointRepo.findPointToUse ({
					Member: `= ${Member.getId ()}`,
					LifetimeRemaining: '> 0'
				})
				PointRemains.sort ((a, b) => {
					return a.getTime().getTime() - b.getTime().getTime()
				})
				await this.fifo (Point, PointRemains)
				Points = PointRemains
			}
			Points.push (Point)

			return await this.save (Member, Points)
		} catch (e) {
			throw new Error (e)
		}
	}

	public async cancel (data: {Reference: number, Activity: string}):Promise <boolean> {
		try {
			let PointToCancel = await this.PointRepo.findByReference (data)
			let Canceler = new PointEntity ()
			Canceler.createPointCancel (PointToCancel)
			let Member = await this.MemberRepo.findOne (PointToCancel.getMember ())
			Member.submitPoint (Canceler)

			await this.PointRepo.delete (PointToCancel.getId ())
			await this.MemberRepo.save (Member)
			return true
		} catch (e) {
			throw new Error (e)
		}
	}
}
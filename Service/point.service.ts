import { MemberRepositoryInterface } from '../RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../RepositoryInterface/point.repositoryinterface'

import { PointEntity, PointCreationFormat } from '../Entity/point.entity'
import { MemberEntity } from '../Entity/member.entity'

export class PointService {
	protected MemberRepo: MemberRepositoryInterface
	protected PointRepo: PointRepositoryInterface

	protected Member: MemberEntity
	protected LifetimeEarns: PointEntity []
	protected LifetimeSpends: PointEntity []

	constructor (MemberRepo: MemberRepositoryInterface, PointRepo: PointRepositoryInterface) {
		this.MemberRepo = MemberRepo
		this.PointRepo = PointRepo
		this.LifetimeEarns = []
		this.LifetimeSpends= []
	}

	public async save (): Promise <void> {
		await this.MemberRepo.save (this.Member)
		this.LifetimeEarns = this.LifetimeEarns.filter (point => {
			return point.HasChanges
		})
		await this.PointRepo.bulkSave (this.LifetimeEarns)
		await this.PointRepo.bulkSave (this.LifetimeSpends)
	}

	public async earn (data: PointCreationFormat): Promise <void> {
		try {
			data.LifetimeAmount = Math.abs (data.LifetimeAmount)
			data.YTDAmount = Math.abs (data.YTDAmount)

			this.Member = await this.MemberRepo.findOne (data.Member)
			let point = new PointEntity ()
			point.create (data)
			this.LifetimeEarns.push (point)
			this.Member.submitPoint (point)
		} catch (e) {
			throw new Error (e)
		}
	}

	public async spend (data: PointCreationFormat): Promise <void> {
		try {

			data.LifetimeAmount = data.LifetimeAmount > 0 ? data.LifetimeAmount * -1 : data.LifetimeAmount
			data.YTDAmount = data.YTDAmount > 0 ? data.YTDAmount * -1 : data.YTDAmount

			let point = new PointEntity ()
			point.create (data)

			this.Member = await this.MemberRepo.findOne (data.Member)
			this.Member.submitPoint (point)

			let criteria = {
				Member: `= ${this.Member.getId ()}`,
				LifetimeRemaining: '> 0'
			}
			this.LifetimeEarns = await this.PointRepo.findPointToUse (criteria)
			await this.fifo (data)

			this.LifetimeSpends.push (point)

		} catch (e) {
			throw new Error (e)
		}
	}

	public expire (Member: MemberEntity, Points: PointEntity []): void {
		try {
			this.LifetimeEarns = Points
			this.Member = Member

			var totalPointExp: number = 0
			this.LifetimeEarns.forEach ( point => {
				totalPointExp += point.getLifetimeRemaining ()
				point.use (point.getLifetimeRemaining ())
			})

			totalPointExp *= -1

			let usage = new PointEntity ()
			usage.create ({
				Member: this.Member.getId (),
				Time: new Date (),
				Activity: 'POINT_EXP',
				Reference: 0,
				YTDAmount: 0,
				LifetimeAmount: totalPointExp,
				Remarks: ''
			})
			this.LifetimeSpends.push (usage)
			this.Member.submitPoint (usage)
		} catch (e) {
			throw new Error (e)
		}
	}

	private async fifo (data: PointCreationFormat): Promise <void[]> {
		try {

			this.LifetimeEarns.sort ((a, b) => {
				return a.getTime().getTime() - b.getTime().getTime()
			})

			var LTinIndex: number = 0
			let walkingUsage = Math.abs(data.LifetimeAmount)
			var deferred: void[] = []
			while (walkingUsage > 0) {
				let pointUnit = this.LifetimeEarns[LTinIndex]
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

}
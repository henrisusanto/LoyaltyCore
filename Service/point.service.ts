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
			this.Member.submitLifetimePoint (point.getLifetimeAmount ())
			this.Member.submitYTDPoint (point.getYTDAmount ())
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
			this.Member.submitYTDPoint (point.getYTDAmount ())
			this.Member.submitLifetimePoint (point.getLifetimeAmount ())

			this.LifetimeEarns = await this.PointRepo.findLifetimeRemainingGreaterThan0SortByTime (data.Member)
			this.fifo (data)
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
			this.Member.submitLifetimePoint (usage.getLifetimeAmount ())
		} catch (e) {
			throw new Error (e)
		}
	}

	private fifo (data: PointCreationFormat): Promise <boolean> {
		try {
			var LTinIndex: number = 0
			let walkingUsage = Math.abs(data.LifetimeAmount)
			while (walkingUsage > 0) {
				let pointUnit = this.LifetimeEarns[LTinIndex]
				let unitRemaining = pointUnit.getLifetimeRemaining ()
				if (walkingUsage > unitRemaining) {
					pointUnit.use (unitRemaining)
					walkingUsage -= unitRemaining
				} else {
					pointUnit.use (walkingUsage)
					walkingUsage = 0
				}
				LTinIndex++
			}
			return true
		} catch (e) { 
			throw new Error (e)
		}
	}

}
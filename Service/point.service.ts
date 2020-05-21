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
		data.LifetimeAmount = Math.abs (data.LifetimeAmount)
		data.YTDAmount = Math.abs (data.YTDAmount)

		this.Member = await this.MemberRepo.findOne (data.Member)
		let point = new PointEntity ()
		point.create (data)
		this.LifetimeEarns.push (point)
		this.Member.submitLifetimePoint (point.getLifetimeAmount ())
		this.Member.submitYTDPoint (point.getYTDAmount ())
	}

	public async spend (data: PointCreationFormat): Promise <void> {
		data.LifetimeAmount = data.LifetimeAmount > 0 ? data.LifetimeAmount * -1 : data.LifetimeAmount
		data.YTDAmount = data.YTDAmount > 0 ? data.YTDAmount * -1 : data.YTDAmount

		if (data.YTDAmount !== 0) {
			let YTDAvailable = await this.PointRepo.SummarizeYTDPointByMember (data.Member)
			if (Math.abs (data.YTDAmount) > YTDAvailable) throw new Error ('Insufficient YTD Points')
		}
		if (data.LifetimeAmount !== 0) {
			let LifetimeAvailable = await this.PointRepo.SummarizeLifetimePointByMember (data.Member)
			if (Math.abs (data.LifetimeAmount) > LifetimeAvailable) throw new Error ('Insufficient Lifetime Points')
		}

		if (await this.fifo (data)) {
			this.Member = await this.MemberRepo.findOne (data.Member)
			let point = new PointEntity ()
			point.create (data)
			this.LifetimeEarns.push (point)
			this.Member.submitLifetimePoint (point.getLifetimeAmount ())
			this.Member.submitYTDPoint (point.getYTDAmount ())
		}
	}

	private async fifo (data: PointCreationFormat): Promise <boolean> {
		try {
			let UsageAmount = Math.abs (data.LifetimeAmount)
			this.LifetimeEarns = await this.PointRepo.findLifetimeRemainingGreaterThan0SortByTime (data.Member)
			var LTinIndex: number = 0
			while (UsageAmount > 0) {
				let UsageToSubmit: number = UsageAmount - this.LifetimeEarns[LTinIndex].getLifetimeRemaining()
				this.LifetimeEarns[LTinIndex].use(UsageToSubmit < 1 ? UsageAmount : UsageToSubmit)
				UsageAmount = UsageToSubmit
				LTinIndex++
			}
			return true
		} catch (e) { 
			throw new Error (e)
		}
	}

}
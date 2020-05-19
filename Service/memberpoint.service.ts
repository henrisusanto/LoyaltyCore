import { MemberRepositoryInterface } from '../RepositoryInterface/member.repositoryinterface'
import { YTDPointRepositoryInterface } from '../RepositoryInterface/ytdpoint.repositoryinterface'
import { LifetimePointRepositoryInterface } from '../RepositoryInterface/lifetimepoint.repositoryinterface'

import { MemberPointEntity } from '../Entity/memberpoint.entity'
import { MemberEntity } from '../Entity/member.entity'
import { YTDPointEntity } from '../Entity/ytdpoint.entity'
import { LifetimePointAggregateRoot } from '../AggregateRoot/lifetimepoint.aggregateroot'

export class MemberPointService {
	protected memberRepo: MemberRepositoryInterface
	protected YTDRepo: YTDPointRepositoryInterface
	protected LifetimeRepo: LifetimePointRepositoryInterface

	protected Member: MemberEntity
	protected YTDPoints: YTDPointEntity []
	protected LifetimePoints: LifetimePointAggregateRoot []

	protected MemberPoint:number
	protected PointType: string
	protected Amount: number
	protected Time: Date
	protected Activity: string
	protected Reference: number
	protected Remarks: string


	constructor (
	 memberRepo: MemberRepositoryInterface,
	 YTDRepo: YTDPointRepositoryInterface,
	 LifetimeRepo: LifetimePointRepositoryInterface
	) {
		this.memberRepo = memberRepo
		this.YTDRepo = YTDRepo
		this.LifetimeRepo = LifetimeRepo

		this.YTDPoints = []
		this.LifetimePoints = []
	}

	public async execute (memberPointEntity: MemberPointEntity): Promise <void> {
		let data = memberPointEntity.serviceGetData ()
		this.MemberPoint = data.Id
		this.PointType = data.PointType
		this.Amount = data.Amount
		this.Time = data.Time
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.Remarks = data.Remarks
		this.Member = await this.memberRepo.findOne (data.Member)

		if ('YTD' === this.PointType && 0 !== this.Amount) this.createYTD ()
		else {
			if (this.Amount > 0) this.addLifetime ()
			if (this.Amount < 0) this.deductLifetime ()
		}

		return await this.save ()
	}

	private async save (): Promise <void> {
		this.LifetimePoints = this.LifetimePoints.filter (LTin => {
			return LTin.HasChanges
		})
		this.YTDPoints = this.YTDPoints.filter (point => {
			return point.isNew ()
		})

		return Promise
		.all([
			this.memberRepo.save (this.Member),
			this.YTDRepo.bulkInsert (this.YTDPoints),
			this.LifetimeRepo.bulkSave (this.LifetimePoints),
		])
	}

	private async createYTD () {
		let point = new YTDPointEntity ()
		point.create({
			Member: this.Member.getId (),
			MemberPoint: this.MemberPoint,
			Activity: this.Activity,
			Reference: this.Reference,
			Amount: this.Amount,
			Remarks: this.Remarks
		})
		this.YTDPoints.push(point)
		this.Member.addYTDPoint (this.Amount)
	}

	private async addLifetime () {
		let point = new LifetimePointAggregateRoot ()
		point.create (this.MemberPoint, this.Member.getId (), this.Activity, this.Reference, this.Amount, this.Remarks)
		this.LifetimePoints.push (point)
		this.Member.addLifetimePoint (this.Amount)
	}

	private async deductLifetime () {
		for (let existing of await this.LifetimeRepo.findAvailableByMember (this.Member.getId ())) {
			this.LifetimePoints.push (existing)
		}

		this.fifo()
		this.Member.addLifetimePoint (this.Amount)
	}

	private fifo () {
		try {
			let UsageAmount = Math.abs (this.Amount)
			this.LifetimePoints.sort ((a, b) => {
				return b.getDateIn().getTime() - a.getDateIn().getTime()
			})

			var LTinIndex: number = 0
			while (UsageAmount > 0) {
				let UsageToSubmit: number = UsageAmount - this.LifetimePoints[LTinIndex].getRemaining()
				this.LifetimePoints[LTinIndex].submitNewUsage (UsageToSubmit < 1 ? UsageAmount : UsageToSubmit, this.Activity, this.Reference, this.Remarks)
				UsageAmount = UsageToSubmit
				LTinIndex++
			}

			return true
		} catch (e) {
			throw new Error (e)
		}
	}

}
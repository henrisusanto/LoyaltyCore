import { MemberRepositoryInterface } from '../RepositoryInterface/member.repositoryinterface'
import { YTDPointRepositoryInterface } from '../RepositoryInterface/ytdpoint.repositoryinterface'
import { LifetimePointRepositoryInterface } from '../RepositoryInterface/lifetimepoint.repositoryinterface'

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

	public async save () {
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

	public async setMember (id: number): Promise <void> {
		this.Member = await this.memberRepo.findOne (id)
	}

	public async earn (Amount: number, Activity: string, Reference: number, Remarks: string) {
		await this.addYTD (Amount, Activity, Reference, Remarks)
		await this.addLifetime (Amount, Activity, Reference, Remarks)
	}

	public async spend (Amount: number, Activity: string, Reference: number, Remarks: string) {
		return await this.deductLifetime (Amount, Activity, Reference, Remarks)
	}

	public async addYTD (Amount: number, Activity: string, Reference: number, Remarks: string) {
		let point = new YTDPointEntity ()
		point.create({
			Member: this.Member.getId (),
			Activity,
			Reference,
			Amount,
			Remarks
		})
		this.YTDPoints.push(point)
		this.Member.addYTDPoint (Amount)
	}

	public async addLifetime (Amount: number, Activity: string, Reference: number, Remarks: string) {
		let point = new LifetimePointAggregateRoot ()
		point.create (this.Member.getId (), Activity, Reference, Amount, Remarks)
		this.LifetimePoints.push (point)
		this.Member.addLifetimePoint (Amount)
	}

	public async deductYTD (Amount: number, Activity: string, Reference: number, Remarks: string) {
		// check if existing YTD point already loaded from persistence
		let existingLoaded = this.YTDPoints.filter (loaded => {
			return !loaded.isNew ()
		})

		// if not loaded yet, load them
		if (existingLoaded.length < 1) for (let existing of await this.YTDRepo.findCurrentYearByMember (this.Member.getId ())) {
			this.YTDPoints.push (existing)
		}

		// validate deduction
		let currentTotalYTD: number = 0
		for (let current of this.YTDPoints) currentTotalYTD += current.getAmount ()
		if (currentTotalYTD < Math.abs (Amount)) throw new Error ('Insufficient YTD Point')

		// use addYTD with negative value
		else {
			Amount = Amount > 0 ? Amount * -1 : Amount
			this.addYTD (Amount, Activity, Reference, Remarks)
		}
	}

	public async deductLifetime (Amount: number, Activity: string, Reference: number, Remarks: string) {
		// check if existing pointusage
		var loaded = this.LifetimePoints.filter (LTin => {
			return !LTin.HasChanges
		})

		// if not loaded yet, then load
		if (loaded.length < 1) for (let existing of await this.LifetimeRepo.findAvailableByMember (this.Member.getId ())) {
			this.LifetimePoints.push (existing)
		}

		// validate amount
		let totalAvailable = 0
		for (let LTin of this.LifetimePoints) totalAvailable += LTin.getRemaining ()
		if (totalAvailable < Math.abs (Amount)) throw new Error ('Insufficient Lifetime Point')
		else return this.fifo(Amount, Activity, Reference, Remarks)

	}

	private fifo (UsageAmount: number, Activity: string, Reference: number, Remarks: string) {
		this.LifetimePoints.sort ((a, b) => {
			return b.getDateIn().getTime() - a.getDateIn().getTime()
		})

		var LTinIndex: number = 0
		while (UsageAmount > 0) {
			let UsageToSubmit: number = UsageAmount - this.LifetimePoints[LTinIndex].getRemaining()
			this.LifetimePoints[LTinIndex].submitNewUsage (UsageToSubmit < 1 ? UsageAmount : UsageToSubmit, Activity, Reference, Remarks)
			UsageAmount = UsageToSubmit
			LTinIndex++
		}

		return true
	}

}
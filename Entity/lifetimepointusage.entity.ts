export interface LifetimePointUsageJSON {
	Id?: number
	Member: number
	MemberPoint: number
	Activity: string
	Reference: number
	LifetimeId: number
	Amount: number
	Remarks: string
}

export class LifetimePointUsageEntity {
	protected Id?: number
	protected Member: number
	protected MemberPoint: number
	protected Activity: string
	protected Reference: number
	protected LifetimeId: number
	protected Amount: number
	protected Remarks: string

	public isNew (): boolean {
		return !this.Id
	}

	public getAmount (): number {
		return this.Amount
	}

	public create (data: LifetimePointUsageJSON): void {
		this.Id = data.Id
		this.Member = data.Member
		this.MemberPoint = data.MemberPoint
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.LifetimeId = data.LifetimeId
		this.Amount = data.Amount
		this.Remarks = data.Remarks
	}

	public fromJSON (data: LifetimePointUsageJSON): void {
		this.Id = data.Id
		this.Member = data.Member
		this.MemberPoint = data.MemberPoint
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.LifetimeId = data.LifetimeId
		this.Amount = data.Amount
		this.Remarks = data.Remarks
	}

	public toJSON (): LifetimePointUsageJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			MemberPoint: this.MemberPoint,
			Activity: this.Activity,
			Reference: this.Reference,
			LifetimeId: this.LifetimeId,
			Amount: this.Amount,
			Remarks: this.Remarks
		}
	}
}
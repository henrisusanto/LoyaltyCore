
export interface LifetimePointInJSON {
	Id: number
	Member: number
	Activity: string
	Reference: number
	DateIn: Date
	Amount: number
	Available: number
}

export class LifetimePointInEntity {
	protected Id: number
	protected Member: number
	protected Activity: string
	protected Reference: number
	protected DateIn: Date
	protected Amount: number
	protected Available: number

	public fromJSON (data: LifetimePointInJSON): void {
		this.Id = data.Id
		this.Member = data.Member
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.DateIn = data.DateIn
		this.Amount = data.Amount
		this.Available = data.Available
	}

	public toJSON (): LifetimePointInJSON {
		return {
			Id : this.Id,
			Member : this.Member,
			Activity : this.Activity,
			Reference : this.Reference,
			DateIn : this.DateIn,
			Amount : this.Amount,
			Available : this.Available
		}
	}

}
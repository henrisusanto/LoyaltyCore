
export interface LifetimepointOutJSON {
	Id: number
	Member: number
	Activity: string
	Reference: number
	PointIn: number
	Amount: number
}

export class LifetimepointOutEntity {
	protected Id: number
	protected Member: number
	protected Activity: string
	protected Reference: number
	protected PointIn: number
	protected Amount: number

	public fromJSON (data: LifetimepointOutJSON): void {
		this.Id = data.Id
		this.Member = data.Member
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.PointIn = data.PointIn
		this.Amount = data.Amount
	}

	public toJSON (): LifetimepointOutJSON {
		return {
			Id : this.Id,
			Member : this.Member,
			Activity : this.Activity,
			Reference : this.Reference,
			PointIn : this.PointIn,
			Amount : this.Amount,
		}
	}

}

export interface YTDPointJSON {
	Id: number
	Member: number
	Activity: string
	Reference: number
	Amount: number
	Year: number
}

export interface YTDPointCreate {
	Member: number
	Activity: string
	Reference: number
	Amount: number
	Year: number
}

export class YTDPointEntity {
	protected Id: number
	protected Member: number
	protected Activity: string
	protected Reference: number
	protected Amount: number
	protected Year: number

	public create (data: YTDPointCreate): void {
		this.Member = data.Member
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.Amount = data.Amount
		this.Year = data.Year
	}

	public toJSON (): YTDPointJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			Activity: this.Activity,
			Reference: this.Reference,
			Amount: this.Amount,
			Year: this.Year
		}
	}

}
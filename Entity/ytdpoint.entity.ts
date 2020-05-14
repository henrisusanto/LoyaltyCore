
export interface YTDPointJSON {
	Id: number
	Member: number
	Activity: string
	Reference: number
	Amount: number
	Year: number
	Remarks: string
}

export interface YTDPointCreate {
	Member: number
	Activity: string
	Reference: number
	Amount: number
	Remarks: string
}

export class YTDPointEntity {
	protected Id: number
	protected Member: number
	protected Activity: string
	protected Reference: number
	protected Amount: number
	protected Year: number
	protected Remarks: string

	public create (data: YTDPointCreate): void {
		this.Member = data.Member
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.Amount = data.Amount
		this.Year = new Date().getFullYear()
		this.Remarks = data.Remarks
	}

	public isNew (): boolean {
		return !this.Id
	}

	public getAmount (): number {
		return this.Amount
	}

	public toJSON (): YTDPointJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			Activity: this.Activity,
			Reference: this.Reference,
			Amount: this.Amount,
			Year: this.Year,
			Remarks: this.Remarks
		}
	}

}
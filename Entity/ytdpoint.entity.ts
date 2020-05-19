
export interface YTDPointJSON {
	Id: number
	Member: number
	MemberPoint: number
	Activity: string
	Reference: number
	Amount: number
	Year: number
	Remarks: string
}

export interface YTDPointCreate {
	Member: number
	MemberPoint: number
	Activity: string
	Reference: number
	Amount: number
	Remarks: string
}

export class YTDPointEntity {
	protected Id: number
	protected Member: number
	protected MemberPoint: number
	protected Activity: string
	protected Reference: number
	protected Amount: number
	protected Year: number
	protected Remarks: string

	public create (data: YTDPointCreate): void {
		this.Member = data.Member
		this.MemberPoint = data.MemberPoint
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

	public fromJSON (data: YTDPointJSON): void {
		this.Id = data.Id
		this.Member = data.Member
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.Amount = data.Amount
		this.Year = data.Year
		this.Remarks = data.Remarks
	}

	public toJSON (): YTDPointJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			MemberPoint: this.MemberPoint,
			Activity: this.Activity,
			Reference: this.Reference,
			Amount: this.Amount,
			Year: this.Year,
			Remarks: this.Remarks
		}
	}

}
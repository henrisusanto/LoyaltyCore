
export interface PointDetailJSON {
	Id: number
	PointHeader: number
	Amount: number
	Activity: string
	ExpiredDate: Date
}

export interface SimplePointDetailJSON {
	PointHeader: number
	Amount: number
	Activity: string
}

export class PointDetailEntity {
	protected Id: number
	protected PointHeader: number
	protected Amount: number
	protected Activity: string
	protected ExpiredDate: Date

	public create (data: SimplePointDetailJSON): void {
		this.PointHeader = data.PointHeader
		this.Amount = data.Amount
		this.Activity = data.Activity

		this.ExpiredDate = new Date(new Date().setFullYear(new Date().getFullYear() + 2))
	}

	public overrideDefaultExpiredDate (ExpiredDate: Date) {
		this.ExpiredDate = ExpiredDate
	}

	public getAmount ():number {
		return this.Amount
	}

	public fromJSON (data: PointDetailJSON): void {
		this.Id = data.Id
		this.PointHeader = data.PointHeader
		this.Amount = data.Amount
		this.Activity = data.Activity
		this.ExpiredDate = data.ExpiredDate
	}

	public toJSON (): PointDetailJSON {
		return {
			Id: this.Id,
			PointHeader: this.PointHeader,
			Amount: this.Amount,
			Activity: this.Activity,
			ExpiredDate: this.ExpiredDate
		}
	}

}
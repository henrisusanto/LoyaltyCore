
export interface PointDetailJSON {
	Id: number
	PointHeader: number
	YTDAmount: number
	LifetimeAmount: number
	Activity: string
	ExpiredDate: Date
}

export interface SimplePointDetailJSON {
	PointHeader: number
	YTDAmount: number
	LifetimeAmount: number
	Activity: string
}

export class PointDetailEntity {
	protected Id: number
	protected PointHeader: number
	protected YTDAmount: number
	protected LifetimeAmount: number
	protected Activity: string
	protected ExpiredDate: Date

	public create (data: SimplePointDetailJSON): void {
		this.PointHeader = data.PointHeader
		this.YTDAmount = data.YTDAmount
		this.LifetimeAmount = data.LifetimeAmount
		this.Activity = data.Activity

		if (this.LifetimeAmount > 0) this.ExpiredDate = new Date(new Date().setFullYear(new Date().getFullYear() + 2))
	}

	public overrideDefaultExpiredDate (ExpiredDate: Date) {
		this.ExpiredDate = ExpiredDate
	}

	public getAmount (): {YTDAmount: number, LifetimeAmount: number} {
		return {
			YTDAmount: this.YTDAmount,
			LifetimeAmount: this.LifetimeAmount
		}
	}

	public toJSON (): PointDetailJSON {
		return {
			Id: this.Id,
			PointHeader: this.PointHeader,
			YTDAmount: this.YTDAmount,
			LifetimeAmount: this.LifetimeAmount,
			Activity: this.Activity,
			ExpiredDate: this.ExpiredDate
		}
	}

}
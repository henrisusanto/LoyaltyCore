export interface PointCreationFormat {
	Parent?: number
	Member: number
	Time: Date
	Activity: string
	Reference: number
	YTDAmount: number
	LifetimeAmount: number
	LifetimeExpiredDate?: Date
	Remarks: string
}

export interface PointJSON {
	Id: number
	Parent: number
	Member: number
	Time: Date
	Activity: string
	Reference: number
	YTDAmount: number
	LifetimeAmount: number
	LifetimeRemaining: number
	LifetimeExpiredDate: Date
	Remarks: string
}

interface PointHistory {
	Id?: number
	Time: Date
	Activity: string
	Reference: number
	Amount: number
	Remaining: number
	ExpiredDate: Date
	Remarks: string
	Details: PointHistory []
}

interface PointReport {
	Member: number
	Time: Date
	Activity: string
	Amount: number
	Remarks: string
}

export class PointEntity {
	protected Id?: number
	protected Parent?: number
	protected Member: number
	protected Time: Date
	protected Activity: string
	protected Reference: number
	protected YTDAmount: number
	protected LifetimeAmount: number
	protected LifetimeRemaining: number
	protected LifetimeExpiredDate: Date
	protected Remarks: string
	public HasChanges: boolean

	public create (data: PointCreationFormat): void {
		this.Parent = data.Parent
		this.Member = data.Member

		if (data.Time instanceof Date) this.Time = data.Time
		else if (data.Time) this.Time = new Date (data.Time)
		else this.Time = new Date ()

		this.Activity = data.Activity
		this.Reference = data.Reference
		this.YTDAmount = data.YTDAmount
		this.LifetimeAmount = data.LifetimeAmount

		if (this.LifetimeAmount > 0) {
			if (data.LifetimeExpiredDate instanceof Date) this.LifetimeExpiredDate = data.LifetimeExpiredDate
			else if (data.LifetimeExpiredDate) this.LifetimeExpiredDate = new Date (data.LifetimeExpiredDate)
			else {
				let Inserted = new Date (this.Time.toString ())
				Inserted.setFullYear(Inserted.getFullYear() + 2)
				Inserted.setMonth(Inserted.getMonth() + 1)
				Inserted.setDate(-1)
				this.LifetimeExpiredDate = new Date(Inserted)
			}
		}

		this.Remarks = data.Remarks

		if (this.LifetimeAmount > 0) this.LifetimeRemaining = this.LifetimeAmount
		this.HasChanges = true
	}

	public getId (): number {
		return this.Id || 0
	}

	public getParent (): number {
		return this.Parent || 0
	}

	public getLifetimeAmount (): number {
		return this.LifetimeAmount
	}

	public getYTDAmount (): number {
		return this.YTDAmount
	}

	public getLifetimeRemaining (): number {
		return this.LifetimeRemaining
	}

	public getMember (): number {
		return this.Member
	}

	public getTime (): Date {
		return this.Time
	}

	public use (point: number): void {
		this.LifetimeRemaining -= Math.abs(point)
		this.HasChanges = true
	}

	public toHistory (): PointHistory {
		return {
			Id: this.Id,
			Time: this.Time,
			Activity: this.Activity,
			Reference: this.Reference,
			Amount: this.LifetimeAmount,
			Remaining: this.LifetimeRemaining,
			ExpiredDate: this.LifetimeExpiredDate,
			Remarks: this.Remarks,
			Details: []
		}
	}

	public toReport (): PointReport {
		return {
			Member: this.Member,
			Time: this.Time,
			Activity: this.Activity,
			Amount: Math.abs (this.LifetimeAmount),
			Remarks: this.Remarks
		}
	}

	public fromJSON (data: PointJSON) {
		this.Id = data.Id
		this.Parent = data.Parent
		this.Member = data.Member
		this.Time = data.Time
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.YTDAmount = data.YTDAmount
		this.LifetimeAmount = data.LifetimeAmount
		this.LifetimeRemaining = data.LifetimeRemaining
		this.LifetimeExpiredDate = data.LifetimeExpiredDate
		this.Remarks = data.Remarks

		this.HasChanges = false
	}

	public toJSON (): PointJSON {
		return {
			Id: this.Id || 0,
			Parent: this.Parent || 0,
			Member: this.Member,
			Time: this.Time,
			Activity: this.Activity,
			Reference: this.Reference,
			YTDAmount: this.YTDAmount,
			LifetimeAmount: this.LifetimeAmount,
			LifetimeRemaining: this.LifetimeRemaining,
			LifetimeExpiredDate: this.LifetimeExpiredDate,
			Remarks: this.Remarks
		}
	}

}
import { PointTypeEntity } from './pointtype.entity'

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
	Rate: number
}

interface PointEarning {
	Member: number
	RawAmount: number
	Rate: PointTypeEntity
	Reference: number
	Parent?: number
}

interface PointSpending {
	Member: number
	RawAmount: number
	Rate: PointTypeEntity
	Reference: number
}

interface PointManual {
	Member: number
	YTD: number
	Lifetime: number
	Rate: PointTypeEntity
	ManualId: number
	Time?: Date
	Remarks?: string
}

interface PointExpirer {
	Member: number
	RawAmount: number
	Rate: PointTypeEntity
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
	protected Rate: number
	public HasChanges: boolean

	public createPointEarning (data: PointEarning): void {
		this.Parent = data.Parent
		this.Member = data.Member
		this.Reference = data.Reference

		let { Code, Rate, ExpiredMonth } = data.Rate.toPoint ()
		let PointAmount = Math.floor (data.RawAmount / Rate)

		this.Activity = Code
		this.Rate = Rate
		this.YTDAmount = PointAmount
		this.LifetimeAmount = PointAmount
		this.LifetimeRemaining = PointAmount

		this.Time = new Date ()
		let ExpiredDate = new Date ()
		ExpiredDate.setMonth (ExpiredDate.getMonth() + ExpiredMonth + 1)
		ExpiredDate.setDate (-1)
		this.LifetimeExpiredDate = new Date(ExpiredDate)

		this.HasChanges = true
	}

	public createPointSpending (data: PointSpending): void {
		this.Member = data.Member
		this.Reference = data.Reference

		this.Time = new Date ()

		let { Code, Rate, ExpiredMonth } = data.Rate.toPoint ()
		this.Activity = Code
		this.Rate = Rate

		let PointAmount = data.RawAmount / Rate
		if (PointAmount > 0) PointAmount *= -1
		this.LifetimeAmount = PointAmount

		this.HasChanges = true
	}

	public createPointManual (data: PointManual): void {
		this.Member = data.Member

		if (data.Time instanceof Date) this.Time = data.Time
		else if (data.Time) this.Time = new Date (data.Time)
		else this.Time = new Date ()

		let { Code, Rate, ExpiredMonth } = data.Rate.toPoint ()
		data.YTD /= Rate
		data.Lifetime /= Rate
		this.Activity = Code
		this.Rate = Rate

		this.Reference = data.ManualId
		this.YTDAmount = data.YTD
		this.LifetimeAmount = data.Lifetime

		if (data.Lifetime > 0) {
			this.LifetimeRemaining = data.Lifetime

			let Inserted = new Date (this.Time.toString ())
			Inserted.setMonth (Inserted.getMonth() + ExpiredMonth + 1)
			Inserted.setDate (-1)
			this.LifetimeExpiredDate = new Date (Inserted)
		}

		this.Remarks = data.Remarks || ''
		this.HasChanges = true
	}

	public createPointExpirer (data: PointExpirer): void {
		this.Member = data.Member
		this.Time = new Date ()

		let { Code, Rate, ExpiredMonth } = data.Rate.toPoint ()
		let PointAmount = data.RawAmount / Rate
		if (PointAmount > 0) PointAmount *= -1
		this.Activity = Code
		this.Rate = Rate

		this.LifetimeAmount = PointAmount
		this.HasChanges = true
	}

	public createPointCancel (pointToCancel): void {
		let { YTD, Lifetime } = pointToCancel.getPointAmount ()
		let Remaining = pointToCancel.getLifetimeRemaining ()
		if (Lifetime !== Remaining) throw new Error ('Point Already used')

		this.Member = pointToCancel.getMember ()
		this.Time = new Date ()
		this.Reference = pointToCancel.getId ()
		this.YTDAmount = YTD * -1
		this.LifetimeAmount = Lifetime * -1
		this.HasChanges = false
	}

	public getId (): number {
		return this.Id || 0
	}

	public getParent (): number {
		return this.Parent || 0
	}

	public getPointAmount (): { Lifetime: number, YTD: number } {
		return {
			Lifetime: this.LifetimeAmount,
			YTD: this.YTDAmount
		}
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

	public toHistory (Rates): PointHistory {
		return {
			Id: this.Id,
			Time: this.Time,
			Activity: Rates[this.Activity],
			Reference: this.Reference,
			Amount: this.LifetimeAmount,
			Remaining: this.LifetimeRemaining,
			ExpiredDate: this.LifetimeExpiredDate,
			Remarks: this.Remarks,
			Details: []
		}
	}

	public toReport (Rates, Members): PointReport {
		return {
			Member: Members[this.Member],
			Time: this.Time,
			Activity: Rates[this.Activity],
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
			Remarks: this.Remarks,
			Rate: this.Rate
		}
	}

}
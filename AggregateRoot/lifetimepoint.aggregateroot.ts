import { LifetimePointUsageEntity, LifetimePointUsageJSON } from '../Entity/lifetimepointusage.entity'

interface LifetimePointJSON {
	Id: number
	Member: number
	Activity: string
	Reference: number
	Amount: number
	Remaining: number
	ExpiredDate: Date
	DateIn: Date
	Remarks: string
	Usage: LifetimePointUsageJSON []
}

export class LifetimePointAggregateRoot {
	protected Id: number
	protected Member: number
	protected Activity: string
	protected Reference: number
	protected Amount: number
	protected Remaining: number
	protected ExpiredDate: Date
	protected DateIn: Date
	protected Remarks: string
	protected Usage: LifetimePointUsageEntity []
	public HasChanges: boolean

	public efficientSaving (): void {
		this.Usage = this.Usage.filter (usage => {
			return usage.isNew ()
		})
	}

	public create (Member: number, Activity: string, Reference: number, Amount: number, Remarks: string): void {
		this.Member = Member
		this.Activity = Activity
		this.Reference = Reference
		this.Amount = Amount
		this.Remarks = Remarks

		this.Remaining = Amount
		this.DateIn = new Date()
		this.ExpiredDate = new Date(this.DateIn.setFullYear(this.DateIn.getFullYear() + 2))

		this.Usage = []
		this.HasChanges = true
	}

	public setDateIn (DateIn: Date): void {
		if ( false === DateIn instanceof Date ) DateIn = DateIn ? new Date (DateIn) : new Date ()
		this.DateIn = DateIn
		this.ExpiredDate = new Date(this.DateIn.setFullYear(this.DateIn.getFullYear() + 2))
	}

	public setExpiredDate (ExpiredDate: Date): void {
		if ( false === ExpiredDate instanceof Date && ExpiredDate) this.ExpiredDate = new Date (ExpiredDate)
		else this.ExpiredDate = ExpiredDate
	}

	public getRemaining (): number {
		return this.Remaining
	}

	public getDateIn (): Date {
		return this.DateIn
	}

	public submitNewUsage (Amount: number, Activity: string, Reference: number, Remarks: string):void {
		let newUsage = new LifetimePointUsageEntity ()
		newUsage.create ({
			Id: undefined,
			Member: this.Member,
			Activity,
			Reference,
			LifetimeId: this.Id,
			Amount,
			Remarks
		})
		this.Usage.push (newUsage)
		this.Remaining -= newUsage.getAmount ()
	}

	public fromJSON (data: LifetimePointJSON) {
		this.Id = data.Id
		this.Member = data.Member
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.Amount = data.Amount
		this.Remaining = data.Remaining
		this.ExpiredDate = data.ExpiredDate
		this.DateIn = data.DateIn
		this.Remarks = data.Remarks
		this.Usage = []

		this.Remaining = this.Amount
		for ( let usageJSON of data.Usage ) {
			let usageEntity = new LifetimePointUsageEntity ()
			usageEntity.fromJSON (usageJSON)
			this.Usage.push (usageEntity)
			this.Remaining -= usageEntity.getAmount ()
		}

		this.HasChanges = false
	}

	public toJSON (): LifetimePointJSON {
		let json: LifetimePointJSON = {
			Id: this.Id,
			Member: this.Member,
			Activity: this.Activity,
			Reference: this.Reference,
			Amount: this.Amount,
			Remaining: this.Remaining,
			ExpiredDate: this.ExpiredDate,
			DateIn: this.DateIn,
			Remarks: this.Remarks,
			Usage: []
		}
		for (let usage of this.Usage) json.Usage.push (usage.toJSON ())
		return json
	}
}
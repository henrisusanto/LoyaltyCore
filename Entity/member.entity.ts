export interface MemberJSON {
	Id: number
	FullName: string
	Email: string
	PhoneNumber: string
	Status: boolean
	RegisterDate: Date
	DateOfBirth: Date
	Tier: number
	LifetimePoint: number
	YTDPoint: number
	LifetimeVisit: number
	YTDVisit: number
	LifetimeSpending: number
	YTDSpending: number	
}

export interface ProfileJSON {
	FullName: string,
	Email: string,
	PhoneNumber: string,
	RegisterDate: Date,
	DateOfBirth: Date
}

export class MemberEntity {
	protected Id: number
	protected FullName: string
	protected Email: string
	protected PhoneNumber: string
	protected Status: boolean
	protected RegisterDate: Date
	protected DateOfBirth: Date
	protected Tier: number
	protected LifetimePoint: number
	protected YTDPoint: number
	protected LifetimeVisit: number
	protected YTDVisit: number
	protected LifetimeSpending: number
	protected YTDSpending: number

	public enroll (data: ProfileJSON): void {
		this.FullName = data.FullName
		this.Email = data.Email
		this.PhoneNumber = data.PhoneNumber
		this.RegisterDate = data.RegisterDate
		this.DateOfBirth = data.DateOfBirth

		this.Status = true
		this.Tier = 0
		this.LifetimePoint = 0
		this.YTDPoint = 0
		this.LifetimeVisit = 0
		this.YTDVisit = 0
		this.LifetimeSpending = 0
		this.YTDSpending = 0
	}

	public updateProfile (data: ProfileJSON): void {
		this.FullName = data.FullName
		this.Email = data.Email
		this.PhoneNumber = data.PhoneNumber
		this.RegisterDate = data.RegisterDate
		this.DateOfBirth = data.DateOfBirth
	}

	public disable () {
		this.Status = false
	}

	public enable () {
		this.Status = true
	}

	public getId (): number {
		return this.Id
	}

	public submitPoint (PointEntity): void {
		if (!this.Status) throw new Error ('Member Inactive')
		let { Lifetime, YTD } = PointEntity.getPointAmount ()

		if (YTD < 0 && this.YTDPoint + YTD < 0) throw new Error ('Insufficient YTD Point')
		else this.YTDPoint += YTD

		if (Lifetime < 0 && this.LifetimePoint + Lifetime < 0) throw new Error ('Insufficient Lifetime Point')
		else this.LifetimePoint += Lifetime
	}

	public getTier (): number {
		return this.Tier
	}

	public setTier (history): void {
		if (!this.Status) throw new Error ('Member Inactive')
		if (this.Tier !== history.getPreviousTier ()) throw new Error ('Current tier not match')
		else this.Tier = history.getNextTier ()
	}

	public getTierCalculationFieldValue (FieldName: string): number {
		return this[FieldName]
	}

	public fromJSON (data: MemberJSON): void {
		this.Id = data.Id
		this.FullName = data.FullName
		this.Email = data.Email
		this.PhoneNumber = data.PhoneNumber
		this.Status = data.Status
		this.RegisterDate = data.RegisterDate
		this.DateOfBirth = data.DateOfBirth
		this.Tier = data.Tier
		this.LifetimePoint = data.LifetimePoint
		this.YTDPoint = data.YTDPoint
		this.LifetimeVisit = data.LifetimeVisit
		this.YTDVisit = data.YTDVisit
		this.LifetimeSpending = data.LifetimeSpending
		this.YTDSpending = data.YTDSpending
	}

	public toJSON (): MemberJSON {
		return {
			Id: this.Id,
			FullName: this.FullName,
			Email: this.Email,
			PhoneNumber: this.PhoneNumber,
			Status: this.Status,
			RegisterDate: this.RegisterDate,
			DateOfBirth: this.DateOfBirth,
			Tier: this.Tier,
			LifetimePoint: this.LifetimePoint,
			YTDPoint: this.YTDPoint,
			LifetimeVisit: this.LifetimeVisit,
			YTDVisit: this.YTDVisit,
			LifetimeSpending: this.LifetimeSpending,
			YTDSpending: this.YTDSpending
		}
	}

}
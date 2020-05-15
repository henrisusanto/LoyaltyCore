export interface ManualPointJSON {
	Id: number
	Member: number
	YTD?: number
	Lifetime?: number
	LifetimeDateIn?: Date
	Remarks?: string
}

export class ManualPointEntity {

	protected Id: number
	protected Member: number
	protected YTD?: number
	protected Lifetime?: number
	protected LifetimeDateIn?: Date
	protected Remarks?: string

	public create (Id: number, Member: number, YTD?: number, Lifetime?: number, LifetimeDateIn?: Date, Remarks?: string) {
		this.Id = Id
		this.Member = Member
		this.YTD = YTD || 0
		this.Lifetime = Lifetime || 0

		if (LifetimeDateIn instanceof Date) this.LifetimeDateIn = LifetimeDateIn
		else if (LifetimeDateIn) this.LifetimeDateIn = new Date (LifetimeDateIn)
		else this.LifetimeDateIn = new Date ()

		this.Remarks = Remarks || ''
	}

	public toJSON (): ManualPointJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			YTD: this.YTD,
			Lifetime: this.Lifetime,
			LifetimeDateIn: this.LifetimeDateIn,
			Remarks: this.Remarks
		}
	}

}
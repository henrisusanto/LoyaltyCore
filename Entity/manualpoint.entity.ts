export interface ManualPointJSON {
	Id: number
	Member: number
	YTD?: number
	Lifetime?: number
	LifetimeDateIn?: Date
	Remarks?: string
}

interface ManualPointFactory {
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

	public create (data: ManualPointFactory) {
		this.Id = data.Id
		this.Member = data.Member
		this.YTD = data.YTD
		this.Lifetime = data.Lifetime

		if (data.LifetimeDateIn instanceof Date) this.LifetimeDateIn = data.LifetimeDateIn
		else if (data.LifetimeDateIn) this.LifetimeDateIn = new Date (data.LifetimeDateIn)
		else this.LifetimeDateIn = new Date ()

		this.Remarks = data.Remarks
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
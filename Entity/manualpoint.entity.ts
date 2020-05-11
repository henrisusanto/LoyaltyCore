
export interface ManualPointJSON {
	Id: number
	Member: number
	ManualDate: Date
	YTD: number
	Lifetime: number
}

export class ManualPointEntity {
	protected Id: number
	protected Member: number
	protected ManualDate: Date
	protected YTD: number
	protected Lifetime: number

	public create (data: ManualPointJSON): void {
		this.Id = data.Id
		this.Member = data.Member
		this.ManualDate = data.ManualDate
		this.YTD = data.YTD
		this.Lifetime = data.Lifetime
	}

	public toJSON (): ManualPointJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			ManualDate: this.ManualDate,
			YTD: this.YTD,
			Lifetime: this.Lifetime
		}
	}

}
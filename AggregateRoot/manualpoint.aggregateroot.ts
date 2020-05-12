
export interface ManualPointJSON {
	Member: number
	ManualDate: Date
	YTD: number
	Lifetime: number
	Remarks: string
}

export class ManualPointAggregateRoot {
	protected Id: number
	protected Member: number
	protected ManualDate: Date
	protected YTD: number
	protected Lifetime: number
	protected Remarks: string

	public create (
		Member: number,
		ManualDate: Date,
		YTD: number,
		Lifetime: number,
		Remarks: string
	): void {
		this.Member = Member
		this.ManualDate = ManualDate
		this.YTD = YTD
		this.Lifetime = Lifetime
		this.Remarks = Remarks
	}

	public setId (id: number): void {
		this.Id = id
	}

	public getId (): number {
		return this.Id
	}

	public toJSON (): ManualPointJSON {
		return {
			Member: this.Member,
			ManualDate: this.ManualDate,
			YTD: this.YTD,
			Lifetime: this.Lifetime,
			Remarks: this.Remarks
		}
	}

}
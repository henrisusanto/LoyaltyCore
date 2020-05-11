
export interface YTDPointJSON {
	Id: number
	Member: number
	Activity: string
	Reference: number
	Amount: number
}

export class YTDPointEntity {
	protected Id: number
	protected Member: number
	protected Activity: string
	protected Reference: number
	protected Amount: number

	public toJSON (): YTDPointJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			Activity: this.Activity,
			Reference: this.Reference,
			Amount: this.Amount
		}
	}

}
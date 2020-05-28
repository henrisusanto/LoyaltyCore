interface TierHistoryJSON {
	Id: number
	Member: number
	Time: Date
	PreviousTier: number
	NextTier: number
	MemberField: string
	FieldValue: number
}

interface CreateHistory {
	Member: number
	PreviousTier: number
	NextTier: number
	MemberField: string
	FieldValue: number
}

export class TierHistoryEntity {

	protected Id: number
	protected Member: number
	protected Time: Date
	protected PreviousTier: number
	protected NextTier: number
	protected MemberField: string
	protected FieldValue: number

	public create (data: CreateHistory): void {
		this.Member = data.Member
		this.Time = new Date()
		this.PreviousTier = data.PreviousTier
		this.NextTier = data.NextTier
		this.MemberField = data.MemberField
		this.FieldValue = data.FieldValue
	}

	public getNextTier (): number {
		return this.NextTier
	}

	public fromJSON (data: TierHistoryJSON) {
		this.Id = data.Id
		this.Member = data.Member
		this.Time = data.Time
		this.PreviousTier = data.PreviousTier
		this.NextTier = data.NextTier
		this.MemberField = data.MemberField
		this.FieldValue = data.FieldValue
	}

	public toJSON (): TierHistoryJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			Time: this.Time,
			PreviousTier: this.PreviousTier,
			NextTier: this.NextTier,
			MemberField: this.MemberField,
			FieldValue: this.FieldValue
		}
	}

}
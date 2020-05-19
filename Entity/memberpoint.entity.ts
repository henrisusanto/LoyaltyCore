
export interface MemberPointJSON {
	Id: number
	Parent: number
	Member: number
	PointType: string
	Amount: number
	Time: Date
	Activity: string
	Reference: number
	Remarks: string
}

interface MemberPointCreate {
	Parent?: number
	Member: number
	PointType: string
	Amount: number
	Time: Date
	Activity: string
	Reference: number
	Remarks: string
}

export class MemberPointEntity {
	protected Id: number
	protected Parent: number
	protected Member: number
	protected PointType: string
	protected Amount: number
	protected Time: Date
	protected Activity: string
	protected Reference: number
	protected Remarks: string

	public create (data: MemberPointCreate): void {
		if (data.Parent) this.Parent = data.Parent
		this.Member = data.Member
		this.PointType = data.PointType
		this.Amount = data.Amount
		this.Time = data.Time
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.Remarks = data.Remarks
	}

	public serviceGetData () {
		return {
			Id: this.Id,
			Member: this.Member,
			PointType: this.PointType,
			Amount: this.Amount,
			Time: this.Time,
			Activity: this.Activity,
			Reference: this.Reference,
			Remarks: this.Remarks
		}
	}

	public fromJSON (data: MemberPointJSON): void {
		this.Id = data.Id
		this.Parent = data.Parent
		this.Member = data.Member
		this.PointType = data.PointType
		this.Amount = data.Amount
		this.Time = data.Time
		this.Activity = data.Activity
		this.Reference = data.Reference
		this.Remarks = data.Remarks
	}

	public toJSON (): MemberPointJSON {
		return {
			Id: this.Id,
			Parent: this.Parent,
			Member: this.Member,
			PointType: this.PointType,
			Amount: this.Amount,
			Time: this.Time,
			Activity: this.Activity,
			Reference: this.Reference,
			Remarks: this.Remarks
		}
	}

}
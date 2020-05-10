import { PointDetailEntity, PointDetailJSON } from '../Entity/pointdetail.entity'

export interface PointHeaderJSON {
	Id: number
	Member: number
	Remarks: string
	Details: PointDetailJSON[]
}

export class PointHeaderAggregateRoot {
	protected Id: number
	protected Member: number
	protected Amount: number
	protected Remarks: string
	protected Details: PointDetailEntity[]

	public ClientAddMemberPoint (Id:number, Member: number, YTDAmount: number, LifetimeAmount: number, Remarks: string) {
		this.Id = Id
		this.Member = Member
		this.Remarks= Remarks

		let detail = new PointDetailEntity ()
		detail.create({
			PointHeader: Id,
			YTDAmount,
			LifetimeAmount,
			Activity: 'MANUAL_ADD'
		})
		this.Details = [detail]
	}

	public ClientDeductMemberPoint (Id:number, Member: number, YTDAmount: number, LifetimeAmount: number, Remarks: string) {
		if (YTDAmount > 0) YTDAmount *= -1
		if (LifetimeAmount > 0) LifetimeAmount *= -1

		this.Id = Id
		this.Member = Member
		this.Remarks= Remarks

		let detail = new PointDetailEntity ()
		detail.create({
			PointHeader: Id,
			YTDAmount,
			LifetimeAmount,
			Activity: 'MANUAL_DEDUCT'
		})
		this.Details = [detail]
	}

	public getMember (): number {
		return this.Member
	}

	public getDetails (): PointDetailEntity[] {
		return this.Details
	}

	public toJSON (): PointHeaderJSON {
		let pdJSON: PointDetailJSON [] = []
		for (let detail of this.Details) {
			pdJSON.push (detail.toJSON ())
		}
		return {
			Id: this.Id,
			Member: this.Member,
			Remarks: this.Remarks,
			Details: pdJSON
		}
	}

}
import { PointDetailEntity, PointDetailJSON } from '../Entity/pointdetail.entity'

export interface PointHeaderJSON {
	Id: number
	Member: number
	Status: string
	Amount: number
	Remarks: string
	Details: PointDetailJSON[]
}

export class PointHeaderAggregateRoot {
	protected Id: number
	protected Member: number
	protected Status: string // Actived, Cancelled
	protected Amount: number
	protected Remarks: string
	protected Details: PointDetailEntity[]

	public ClientAddMemberPoint (Id:number, Member: number, Amount: number, Remarks: string) {
		this.Id = Id
		this.Member = Member
		this.Status = 'Actived'
		this.Amount = Amount
		this.Remarks= Remarks

		let detail = new PointDetailEntity ()
		detail.create({
			PointHeader: Id,
			Amount,
			Activity: 'MANUAL_ADD'
		})
		this.Details = [detail]
	}

	public ClientDeductMemberPoint (Id:number, Member: number, Amount: number, Remarks: string) {
		Amount *= -1

		this.Id = Id
		this.Member = Member
		this.Status = 'Actived'
		this.Amount = Amount
		this.Remarks= Remarks

		let detail = new PointDetailEntity ()
		detail.create({
			PointHeader: Id,
			Amount,
			Activity: 'MANUAL_DEDUCT'
		})
		this.Details = [detail]
	}

	public SystemExpireMemberPoint (Id: number, Member: number, Details: PointDetailEntity []) {
		this.Id = Id
		this.Member = Member
		this.Status = 'Actived'
		this.Amount = 0
		this.Details= []

		for ( let detail of Details ) {
			this.Amount -= detail.getAmount ()

			let expDetail = new PointDetailEntity ()
			expDetail.create ({
				PointHeader: Id,
				Amount: detail.getAmount () * -1,
				Activity: 'POINT_EXPIRED'
			})
			expDetail.overrideDefaultExpiredDate (new Date ())
			this.Details.push (expDetail)
		}

	}

	public toJSON (): PointHeaderJSON {
		let pdJSON: PointDetailJSON [] = []
		for (let detail of this.Details) {
			pdJSON.push (detail.toJSON ())
		}
		return {
			Id: this.Id,
			Member: this.Member,
			Status: this.Status,
			Amount: this.Amount,
			Remarks: this.Remarks,
			Details: pdJSON
		}
	}

	public getDataForUpdatingMemberPoint () {
		return {
			Member: this.Member,
			Amount: this.Amount
		}
	}

}
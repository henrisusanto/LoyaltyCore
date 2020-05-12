import { YTDPointEntity, YTDPointJSON } from '../Entity/ytdpoint.entity'
import { LifetimePointInEntity, LifetimePointInJSON } from '../Entity/lifetimepointin.entity'
import { LifetimepointOutEntity, LifetimepointOutJSON } from '../Entity/lifetimepointout.entity'

export interface ManualPointJSON {
	Member: number
	ManualDate: Date
	YTD: number
	Lifetime: number
	Remarks: string
	YTDPoint: YTDPointJSON []
	LifetimePointIn: LifetimePointInJSON []
	LifetimepointOut: LifetimepointOutJSON []
}

export class ManualPointAggregateRoot {
	protected Id: number
	protected Member: number
	protected ManualDate: Date
	protected YTD: number
	protected Lifetime: number
	protected Remarks: string
	protected YTDPoint: YTDPointEntity []
	protected LifetimePointIn: LifetimePointInEntity []
	protected LifetimepointOut: LifetimepointOutEntity []

	public add (
		Id: number,
		Member: number,
		ManualDate: Date,
		YTD: number,
		Lifetime: number,
		Remarks: string
	): void {
		this.Member = Member

		if ( false === ManualDate instanceof Date ) {
			ManualDate = ManualDate ? new Date (ManualDate) : new Date ()
		}
		this.ManualDate = ManualDate

		this.YTD = YTD > 0 ? YTD : -1 * YTD
		this.Lifetime = Lifetime > 0 ? Lifetime : -1 * Lifetime
		this.Remarks = Remarks
		this.YTDPoint = []
		this.LifetimePointIn = []
		this.LifetimepointOut = []

		if (this.Lifetime > 0) {
			let lifetimein = new LifetimePointInEntity ()
			lifetimein.create ({
				Member: this.Member,
				Activity: 'MANUAL_ADD',
				Reference: this.Id,
				DateIn: this.ManualDate,
				Amount: this.Lifetime
			})
			this.LifetimePointIn.push (lifetimein)
		}

		if (this.YTD > 0) {
			let YTDin = new YTDPointEntity ()
			YTDin.create ({
				Member: this.Member,
				Activity: 'MANUAL_ADD',
				Reference: this.Id,
				Amount: this.YTD,
				Year: this.ManualDate.getFullYear ()
			})
			this.YTDPoint.push (YTDin)
		}
	}

	public toJSON (): ManualPointJSON {
		let manualPointJSON: ManualPointJSON = {
			Member: this.Member,
			ManualDate: this.ManualDate,
			YTD: this.YTD,
			Lifetime: this.Lifetime,
			Remarks: this.Remarks,
			YTDPoint: [],
			LifetimePointIn: [],
			LifetimepointOut: [],

		}

		for (let ytd of this.YTDPoint) manualPointJSON.YTDPoint.push (ytd.toJSON ())
		for (let ltin of this.LifetimePointIn) manualPointJSON.LifetimePointIn.push (ltin.toJSON ())
		for (let ltout of this.LifetimepointOut) manualPointJSON.LifetimepointOut.push (ltout.toJSON ())

		return manualPointJSON
	}

}
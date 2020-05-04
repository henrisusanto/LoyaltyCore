import { QualificationValueObject, QualificationJSON, SimpleQualificationJSON } from '../ValueObject/qualification.valueobject'

export interface TierJSON {
	 Id: number
	 Name: string
	 Year: number
	 Qualifications: QualificationJSON []
}

export interface SimpleTierJSON {
	Name: string,
	Qualifications: SimpleQualificationJSON[]
}

export class TierAggregateRoot {
	protected Id: number
	protected Name: string
	protected Year: number
	protected Qualifications: QualificationValueObject[]

	public createDraft (Id: number, Year: number, data: SimpleTierJSON) {
		this.Id = Id
		this.Year = Year
		this.Name = data.Name
		this.Qualifications = []

		for (let daqu of data.Qualifications) {
			let qualification = new QualificationValueObject ()
			qualification.createDraft(this.Id, daqu)
			this.Qualifications.push(qualification)
		}
	}

	public fromJSON (data: TierJSON): void {
		this.Id = data.Id
		this.Name = data.Name
		this.Year = data.Year
		this.Qualifications = []
		for (let q of data.Qualifications) {
			let qe = new QualificationValueObject ()
			qe.fromJSON (q)
			this.Qualifications.push (qe)
		}
	}

	public toJSON (): TierJSON {
		let tierJSON: TierJSON = {
			Id: this.Id,
			Name: this.Name,
			Year: this.Year,
			Qualifications: []
		}
		for (let qualification of this.Qualifications) {
			tierJSON.Qualifications.push (qualification.toJSON ())
		}
		return tierJSON
	}

	public toSimpleJSON (): SimpleTierJSON {
		let simpleQualificationJSONs: SimpleQualificationJSON[] = []
		for ( let q of this.Qualifications ) {
			simpleQualificationJSONs.push (q.toSimpleJSON ())
		}
		return {
			Name: this.Name,
			Qualifications: simpleQualificationJSONs
		}
	}

}
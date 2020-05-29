import { QualificationValueObject, QualificationJSON, SimpleQualificationJSON, QalificationCondition } from '../ValueObject/qualification.valueobject'

export interface TierJSON {
	 Id: number
	 Name: string
	 Year: number
	 Level: number
	 Qualifications: QualificationJSON []
}

export interface SimpleTierJSON {
	Name: string
	Level: number
	Qualifications: SimpleQualificationJSON[]
}

export interface TierCondition {
	OR: {}[],
	AND: {}[]
}

export class TierAggregateRoot {
	protected Id: number
	protected Name: string
	protected Year: number
	protected Level: number
	protected Qualifications: QualificationValueObject[]

	public createDraft (Id: number, Year: number, data: SimpleTierJSON) {
		this.Id = Id
		this.Year = Year
		this.Name = data.Name
		this.Level= data.Level
		this.Qualifications = []

		for (let daqu of data.Qualifications) {
			let qualification = new QualificationValueObject ()
			qualification.createDraft(this.Id, daqu)
			this.Qualifications.push(qualification)
		}
	}

	public getId (): number {
		return this.Id
	}

	public getLevel (): number {
		return this.Level
	}

	public getQualifications (): QualificationValueObject[] {
		return this.Qualifications
	}

	public fromJSON (data: TierJSON): void {
		this.Id = data.Id
		this.Name = data.Name
		this.Year = data.Year
		this.Level= data.Level
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
			Level: this.Level,
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
			Level: this.Level,
			Qualifications: simpleQualificationJSONs
		}
	}

	public toDowngradeCriteria (): TierCondition {
		let OR: {}[] = []

		let AND: {}[] = this.Qualifications.map (q => {
			let criteria = q.toMemberCriteria ()
			criteria.Operator = '<'
			return criteria
		})

		AND.push ({
			Field: 'Tier',
			Operator: '=',
			FieldValue: this.Id
		})

		return { OR, AND }
	}

	public toUpgradeCriteria (LowerLevelTierIDs: number []) {
		let OR: {}[] = this.Qualifications.map (q => {
			return q.toMemberCriteria ()
		})

		let AND: {}[] = [{
			Field: 'Tier',
			Operator: 'IN',
			FieldValue: LowerLevelTierIDs
		}]

		return { OR, AND }
	}

}
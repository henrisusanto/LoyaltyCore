export interface QualificationJSON {
	Tier: number
	MemberField: string
	ThresholdValue: number
}

export interface SimpleQualificationJSON {
	MemberField: string
	ThresholdValue: number
}

export interface QalificationCondition {
	Field: string
	Operator: string
	FieldValue: number
}

export class QualificationValueObject {
	protected Tier: number
	protected MemberField: string
	protected ThresholdValue: number

	public createDraft (Tier: number, data: SimpleQualificationJSON): void {
		this.Tier = Tier
		this.MemberField = data.MemberField
		this.ThresholdValue = data.ThresholdValue
	}

	public toJSON (): QualificationJSON {
		return {
			Tier: this.Tier,
			MemberField: this.MemberField,
			ThresholdValue: this.ThresholdValue
		}
	}

	public fromJSON (data: QualificationJSON) {
		this.Tier = data.Tier
		this.MemberField = data.MemberField
		this.ThresholdValue = data.ThresholdValue
	}

	public toSimpleJSON (): SimpleQualificationJSON {
		return {
			MemberField: this.MemberField,
			ThresholdValue: this.ThresholdValue
		}
	}

	public toMemberCriteria (): QalificationCondition {
		return {
			Field: this.MemberField,
			Operator: '>=',
			FieldValue: this.ThresholdValue
		}
	}

}
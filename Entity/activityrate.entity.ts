export interface ActivityRateJSON {
	Code: string
	Description: string
	Rate: number
	ExpiredMonth: number
}

interface PointCreation {
	Code: string
	Rate: number
	ExpiredMonth: number
}

interface PointHistory {
	Code: string
	Description: string
}

export class ActivityRateEntity {
	protected Code: string
	protected Description: string
	protected Rate: number
	protected ExpiredMonth: number

	public update (data: ActivityRateJSON) {
		this.Description = data.Description
		this.Rate = data.Rate
		this.ExpiredMonth = data.ExpiredMonth

		if (['EXPIRED', 'MANUAL'].indexOf(this.Code) > -1) {
			this.Rate = 1
		}
	}

	public toPoint (): PointCreation {
		return {
			Code: this.Code,
			Rate: this.Rate,
			ExpiredMonth: this.ExpiredMonth
		}
	}

	public toHistory (): PointHistory {
		return {
			Code: this.Code,
			Description: this.Description
		}
	}

	public toJSON (): ActivityRateJSON {
		return {
			Code: this.Code,
			Description: this.Description,
			Rate: this.Rate,
			ExpiredMonth: this.ExpiredMonth
		}
	}

	public fromJSON (data: ActivityRateJSON): void {
		this.Code = data.Code
		this.Description = data.Description
		this.Rate = data.Rate
		this.ExpiredMonth = data.ExpiredMonth
	}

}
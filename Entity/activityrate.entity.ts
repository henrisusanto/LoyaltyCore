export interface ActivityRateJSON {
	Code: string
	Description: string
	Rate: number	
}

export class ActivityRateEntity {
	protected Code: string
	protected Description: string
	protected Rate: number

	public update (data: ActivityRateJSON) {
		this.Description = data.Description
		this.Rate = data.Rate
	}

	public calculate (rawAmount: number): number {
		return rawAmount / this.Rate
	}

	public toJSON (): ActivityRateJSON {
		return {
			Code: this.Code,
			Description: this.Description,
			Rate: this.Rate
		}
	}

	public fromJSON (data: ActivityRateJSON): void {
		this.Code = data.Code
		this.Description = data.Description
		this.Rate = data.Rate
	}

}
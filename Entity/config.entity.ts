
export interface ConfigJSON {
	Id: number
	Name: string
	ConfigValue: string
}

export class ConfigEntity {
	protected Id: number
	protected Name: string
	protected ConfigValue: string

	public updateValue (value: string): void {
		this.ConfigValue = value
	}

	public fromJSON (data: ConfigJSON): void {
		this.Id = data.Id
		this.Name = data.Name
		this.ConfigValue = data.ConfigValue
	}

	public toJSON (): ConfigJSON {
		return {
			Id: this.Id,
			Name: this.Name,
			ConfigValue: this.ConfigValue,
		}
	}

}
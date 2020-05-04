import { ConfigRepositoryInterface } from '../../RepositoryInterface/config.repositoryinterface'
import { ConfigEntity } from '../../Entity/config.entity'

export class ClientUpdatePointName {

	protected repository

	constructor (repositoryConcrete: ConfigRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (name: string, abbr: string) {
    try {

      const configName = await this.repository.findByName ('PointCurrencyName')
      const configAbbr = await this.repository.findByName ('PointCurrencyAbbr')

      configName.updateValue (name)
      configAbbr.updateValue (abbr)

      await this.repository.save (configName)
      await this.repository.save (configAbbr)

      return true
    } catch (error) {
      throw new Error (error)
    }
  }

}

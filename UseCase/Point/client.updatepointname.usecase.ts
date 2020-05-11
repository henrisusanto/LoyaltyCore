import { ConfigRepositoryInterface } from '../../RepositoryInterface/config.repositoryinterface'
import { ConfigEntity } from '../../Entity/config.entity'

export class ClientUpdatePointNameUseCase {

	protected repository

	constructor (repositoryConcrete: ConfigRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (name: string, abbr: string) {
    try {
      let configName, configAbbr
      try {
        let configName = await this.repository.findByName ('PointCurrencyName')
        let configAbbr = await this.repository.findByName ('PointCurrencyAbbr')
        configName.updateValue (name)
        configAbbr.updateValue (abbr)
      } catch (e) {
        configName = new ConfigEntity ()
        configName.create ('PointCurrencyName', name)
        configAbbr = new ConfigEntity ()
        configAbbr.create ('PointCurrencyAbbr', abbr)
      }
      await this.repository.save (configName)
      await this.repository.save (configAbbr)
      return true
    } catch (error) {
      throw new Error (error)
    }
  }

}

import { ConfigRepositoryInterface } from '../../RepositoryInterface/config.repositoryinterface'
import { ConfigEntity } from '../../Entity/config.entity'

export class ClientGetPointNameUseCase {

	protected repository

	constructor (repositoryConcrete: ConfigRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute () {
    try {
      try {
        let configName = await this.repository.findByName ('PointCurrencyName')
        let configAbbr = await this.repository.findByName ('PointCurrencyAbbr')
        let Name = configName.getConfigValue ()
        let Abbr = configAbbr.getConfigValue ()
        return { Name, Abbr }
      } catch (e) {
        throw new Error (e)
      }
    } catch (error) {
      throw new Error (error)
    }
  }

}

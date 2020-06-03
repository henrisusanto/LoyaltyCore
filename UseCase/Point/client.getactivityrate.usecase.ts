import { ActivityRateRepositoryInterface } from '../../RepositoryInterface/activityrate.repositoryinterface'
import { ActivityRateEntity } from '../../Entity/activityrate.entity'

export class ClientGetActivityRateUseCase {
	protected repository

	constructor (repo: ActivityRateRepositoryInterface) {
		this.repository = repo
	}

  public async execute () {
    try {
      let domains = await this.repository.getAll ()
      return domains.map (domain => {
        return domain.toJSON ()
      })
    } catch (e) {
      throw new Error (e)
    }
  }

}

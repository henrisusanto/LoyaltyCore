import { ActivityRateRepositoryInterface } from '../../RepositoryInterface/activityrate.repositoryinterface'
import { ActivityRateEntity, ActivityRateJSON } from '../../Entity/activityrate.entity'

export class ClientUpdateActivityRateUseCase {
	protected repository

	constructor (repo: ActivityRateRepositoryInterface) {
		this.repository = repo
	}

  public async execute (data: ActivityRateJSON[]): Promise <void []> {
    try {

      var Deferred: Promise <void>[] = []
      data.forEach (async json => {
        let entity = await this.repository.findByCode (json.Code)
        if (entity) {
          entity.update (json)
          Deferred.push (this.repository.update (entity))
        }
      })
      return Promise.all(Deferred)

    } catch (e) {
      throw new Error (e)
    }
  }

}

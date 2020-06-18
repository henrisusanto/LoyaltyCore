import { PointTypeRepositoryInterface } from '../../RepositoryInterface/pointtype.repositoryinterface'
import { PointTypeEntity, PointTypeJSON } from '../../Entity/pointtype.entity'

export class ClientUpdatePointTypeUseCase {
	protected repository

	constructor (repo: PointTypeRepositoryInterface) {
		this.repository = repo
	}

  public async execute (data: PointTypeJSON[]): Promise <void []> {
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

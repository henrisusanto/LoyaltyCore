import { PointTypeRepositoryInterface } from '../../RepositoryInterface/pointtype.repositoryinterface'
import { PointTypeEntity } from '../../Entity/pointtype.entity'

export class ClientGetPointTypeUseCase {
	protected repository

	constructor (repo: PointTypeRepositoryInterface) {
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

import { ManualPointRepositoryInterface } from '../../RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointEntity } from '../../Entity/manualpoint.entity'

export class ClientAddMemberPointUseCase {

	protected repository

	constructor (repository: ManualPointRepositoryInterface) {
		this.repository = repository
	}

  public async execute (Member: number, ManualDate: Date, YTD: number, Lifetime: number) {
    try {
      let manualPoint = new ManualPointEntity ()
      manualPoint.create({
        Id: await this.repository.generateId (),
        Member,
        ManualDate,
        YTD,
        Lifetime
      })
      this.repository.insert (manualPoint)
    } catch (error) {
      throw new Error (error)
    }
  }

}

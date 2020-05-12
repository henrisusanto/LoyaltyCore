import { ManualPointRepositoryInterface } from '../../RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointAggregateRoot } from '../../AggregateRoot/manualpoint.aggregateroot'

export class ClientAddMemberPointUseCase {

	protected repository

	constructor (repository: ManualPointRepositoryInterface) {
		this.repository = repository
	}

  public async execute (Member: number, ManualDate: Date, YTD: number, Lifetime: number, Remarks: string) {
    try {
      let manualPoint = new ManualPointAggregateRoot ()
      manualPoint.create(
        Member,
        ManualDate,
        YTD,
        Lifetime,
        Remarks
      )
      return await this.repository.insert (manualPoint)
    } catch (error) {
      throw new Error (error)
    }
  }

}

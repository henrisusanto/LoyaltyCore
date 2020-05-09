import { TierRepositoryInterface } from '../../RepositoryInterface/tier.repositoryinterface'
import { TierJSON } from '../../AggregateRoot/tier.aggregateroot'

export class ClientGetDraftTierUseCase {

	protected repository

	constructor (repositoryConcrete: TierRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (Year: number) {
    if (Year <= new Date().getFullYear()) throw new Error ('Draft only for future year')
    try {
      let tiersJSONs: TierJSON[] = []
      for (let tierAggregateRoot of await this.repository.findByYear (Year)) {
        tiersJSONs.push (tierAggregateRoot.toSimpleJSON ())
      }
      return tiersJSONs
    } catch (error) {
      throw new Error (error)
    }
  }

}

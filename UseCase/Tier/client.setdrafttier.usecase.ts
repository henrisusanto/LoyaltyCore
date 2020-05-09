import { TierRepositoryInterface } from '../../RepositoryInterface/tier.repositoryinterface'
import { TierAggregateRoot, SimpleTierJSON } from '../../AggregateRoot/tier.aggregateroot'

export class ClientSetDraftTierUseCase {

	protected repository

	constructor (repositoryConcrete: TierRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (Year: number, Tiers: SimpleTierJSON []) {
    if (Year <= new Date().getFullYear()) throw new Error ('Draft could only set for future year')
    try {
      for (let Tier of Tiers) {
        let tierAggregateRoot = new TierAggregateRoot ()
        let Id = await this.repository.generateId ()
        tierAggregateRoot.createDraft (Id, Year, Tier)
        await this.repository.save (tierAggregateRoot)
      }
      return Year
    } catch (error) {
      throw new Error (error)
    }
  }

}

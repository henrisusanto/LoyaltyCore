import { TierRepositoryInterface } from '../../RepositoryInterface/tier.repositoryinterface'

export class ClientDeleteDraftTier {

	protected repository

	constructor (repositoryConcrete: TierRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (Year: number) {
    if (Year <= new Date().getFullYear()) throw new Error ('Draft only for future year')
    try {
      await this.repository.deleteByYear (Year)
      return Year
    } catch (error) {
      throw new Error (error)
    }
  }

}

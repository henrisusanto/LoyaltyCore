import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { TierRepositoryInterface } from '../../RepositoryInterface/tier.repositoryinterface'

export class ClientGetMemberProfileUseCase {
  protected repository: MemberRepositoryInterface
  protected tierRepo: TierRepositoryInterface

	constructor (
    repositoryConcrete: MemberRepositoryInterface,
    tierRepo: TierRepositoryInterface
  ) {
    this.repository = repositoryConcrete
    this.tierRepo = tierRepo
	}

  public async execute (id: number) {
    try {
      const member = await this.repository.findOne(id)
      const tier = await this.tierRepo.findById (member.getTier ())
      return member.toReport (tier)
    } catch (error) {
      throw new Error (error)
    }
  }

}

import { MemberRepositoryInterface, MemberListParameter } from '../../RepositoryInterface/member.repositoryinterface'
import { TierRepositoryInterface } from '../../RepositoryInterface/tier.repositoryinterface'

export class ClientGetMemberListUseCase {
  protected repository: MemberRepositoryInterface
  protected tierRepo: TierRepositoryInterface

	constructor (
    repositoryConcrete: MemberRepositoryInterface,
    tierRepo: TierRepositoryInterface
  ) {
    this.repository = repositoryConcrete
    this.tierRepo = tierRepo
	}

  public async execute (
    recordPerPage: number,
    currentPage: number,
    searchKeyword: string,
    sortBy: string,
    order: string
  ) {
    recordPerPage = recordPerPage || 5
    currentPage = currentPage || 1
    searchKeyword = searchKeyword || ''
    sortBy = sortBy || 'Id'
    order = order && 'desc' === order.toLowerCase () ? 'DESC' : 'ASC'
    const parameters: MemberListParameter = {
      limit: recordPerPage,
      offset: (currentPage - 1) * recordPerPage,
      search: searchKeyword,
      searchableFields: ['FullName', 'Email', 'PhoneNumber'],
      orderBy: sortBy,
      order
    }

    try {
      const members = await this.repository.findAll(parameters)
      const tiers = await this.tierRepo.findByYear (new Date (). getFullYear ())

      return members.map(memberEntity => {
        let tier = tiers.filter(tier => tier.getId () === memberEntity.getTier ())[0]
        return memberEntity.toReport (tier)
      })
    } catch (error) {
      throw new Error (error)
    }
  }

}

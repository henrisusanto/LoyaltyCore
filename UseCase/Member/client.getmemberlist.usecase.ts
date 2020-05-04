import { MemberRepositoryInterface, MemberListParameter } from '../../RepositoryInterface/member.repositoryinterface'

export class ClientGetMemberList {
	protected repository

	constructor (repositoryConcrete: MemberRepositoryInterface) {
		this.repository = repositoryConcrete
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
    sortBy = sortBy || 'id'
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
      return members.map(memberEntity => {
        return memberEntity.toJSON ()
      })
    } catch (error) {
      throw new Error (error)
    }
  }

}

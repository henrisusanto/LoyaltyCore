import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'

export class ClientGetMemberProfile {
	protected repository

	constructor (repositoryConcrete: MemberRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (id: number) {
    try {
      const member = await this.repository.findOne(id)
      return member.toJSON ()
    } catch (error) {
      throw new Error (error)
    }
  }

}

import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'

export class ClientDisableMemberUseCase {

	protected repository

	constructor (repositoryConcrete: MemberRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (id: number) {
    try {
      var memberEntity = await this.repository.findOne(id)
      memberEntity.disable()
      return await this.repository.save(memberEntity)
    } catch (error) {
      throw new Error (error)
    }
  }

}

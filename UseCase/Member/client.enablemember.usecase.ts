import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'

export class ClientEnableMember {

	protected repository

	constructor (repositoryConcrete: MemberRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (id: number) {
    try {
      var memberEntity = await this.repository.findOne(id)
      memberEntity.enable()
      return await this.repository.save(memberEntity)
    } catch (error) {
      throw new Error (error)
    }
  }

}

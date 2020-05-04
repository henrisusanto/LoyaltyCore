import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { MemberEntity, ProfileJSON } from '../../Entity/member.entity'

export class ClientUpdateMemberProfile {

	protected repository

	constructor (repositoryConcrete: MemberRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async  execute (
    Id: number,
    FullName: string,
    Email: string,
    PhoneNumber: string,
    RegisterDate: Date,
    DateOfBirth: Date
  ) {
    try {
      const member = await this.repository.findOne (Id)
      if (!member) throw new Error ('Member not found')
      const profile: ProfileJSON = {
        FullName: FullName,
        Email: Email,
        PhoneNumber: PhoneNumber,
        RegisterDate: RegisterDate,
        DateOfBirth: DateOfBirth
      }
      member.updateProfile (profile)
      return await this.repository.save(member)
    } catch (error) {
      throw new Error (error)
    }
  }

}

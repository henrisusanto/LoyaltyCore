import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'

export class EventUpdateMemberPointUseCase {

  protected repository

  constructor (repositoryConcrete: MemberRepositoryInterface) {
    this.repository = repositoryConcrete
  }

  public async execute (pointHeader) {
    try {
      let id = pointHeader.getMember ()
      let member = await this.repository.findOne(id)
      for (let detail of pointHeader.getDetails ()) {
        let { YTDAmount, LifetimeAmount } = detail.getAmount ()
        member.addYTDPoint (YTDAmount)
        member.addLifetimePoint (LifetimeAmount)
      }
      return await this.repository.save (member)
    } catch (error) {
      throw new Error (error)
    }
  }

}

import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { PointHeaderAggregateRoot } from '../../AggregateRoot/pointheader.aggregateroot'

export class EventUpdateMemberPointUseCase {

  protected repository

  constructor (repositoryConcrete: MemberRepositoryInterface) {
    this.repository = repositoryConcrete
  }

  public async execute (pointHeader: PointHeaderAggregateRoot) {
    try {
      let { Member, Amount } = pointHeader.getDataForUpdatingMemberPoint ()
      let member = await this.repository.findOne(Member)
      member.updatePoint (Amount)
      return await this.repository.save (member)
    } catch (error) {
      throw new Error (error)
    }
  }

}

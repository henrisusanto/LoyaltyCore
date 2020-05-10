import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { PointHeaderAggregateRoot } from '../../AggregateRoot/pointheader.aggregateroot'

export class ClientAddMemberPointUseCase {

	protected repository

	constructor (repositoryConcrete: PointRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (Member: number, YTDAmount: number, LifetimeAmount:number, Remarks: string) {
    try {
      let Point = new PointHeaderAggregateRoot ()
      Point.ClientAddMemberPoint (
        await this.repository.generateId (),
        Member,
        YTDAmount,
        LifetimeAmount,
        Remarks
      )
      return this.repository.insert (Point)
    } catch (error) {
      throw new Error (error)
    }
  }

}

import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { PointHeaderAggregateRoot } from '../../AggregateRoot/pointheader.aggregateroot'

export class ClientAddMemberPoint {

	protected repository

	constructor (repositoryConcrete: PointRepositoryInterface) {
		this.repository = repositoryConcrete
	}

  public async execute (Member: number, Amount: number, Remarks: string) {
    try {
      let Point = new PointHeaderAggregateRoot ()
      Point.ClientAddMemberPoint (
        await this.repository.generateId (),
        Member,
        Amount,
        Remarks
      )
      return this.repository.insert (Point)
    } catch (error) {
      throw new Error (error)
    }
  }

}

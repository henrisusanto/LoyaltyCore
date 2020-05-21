import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { PointEntity } from '../../Entity/point.entity'

export class ClientGetMemberPointHistory {

	protected repository: PointRepositoryInterface

	constructor (repository: PointRepositoryInterface) {
		this.repository = repository
	}

	public async execute (Member: number) {
		let parents = await this.repository.findLifetimeGreaterThan0HasNoParentSortByTime (Member)
		let parentIDs = parents.map (parent => {
			return parent.getId ()
		})
		let childs = await this.repository.findPointByParentIds (parentIDs)

		let result = parents.map(parent => {
			return parent.toHistory ()
		})

		result.forEach (res => {
			childs.filter (child => {
				return child.getParent() === res.Id
			})
			.forEach (child => {
				res.Details.push (child.toHistory ())
			})
		})

		return result
	}
}
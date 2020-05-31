import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { PointEntity } from '../../Entity/point.entity'

export class ClientGetMemberPointHistory {

	protected repository: PointRepositoryInterface

	constructor (repository: PointRepositoryInterface) {
		this.repository = repository
	}

	public async execute (Member: number) {
		let criteria = 
		{
			Parent: '= 0',
			Member: `= ${Member}`,
		}

		var parents = await this.repository.findHistory (criteria)
		criteria.Parent = '<> 0'
		var childs = await this.repository.findHistory (criteria)

		parents.sort ((a, b) => {
			return a.getTime ().getTime() - b.getTime ().getTime ()
		})

		let result = parents.map(parent => {
			let history = parent.toHistory ()
			history.Details = childs
				.filter (child => {
					return parent.getId () === child.getParent ()
				})
				.map (child => {
					return child.toHistory ()
				})
				return history
		})

		return result
	}
}
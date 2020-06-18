import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../RepositoryInterface/pointtype.repositoryinterface'
import { PointEntity } from '../../Entity/point.entity'

export class ClientGetMemberPointHistory {

	protected repository: PointRepositoryInterface
	protected rateRepo: PointTypeRepositoryInterface

	constructor (repository: PointRepositoryInterface, rateRepo: PointTypeRepositoryInterface) {
		this.repository = repository
		this.rateRepo = rateRepo
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

		let rates = await this.rateRepo.getAll ()
		var Rates = {}
		rates.forEach (rate => {
			let { Code, Description } = rate.toHistory ()
			Rates[Code] = Description
		})

		parents.sort ((a, b) => {
			return a.getTime ().getTime() - b.getTime ().getTime ()
		})

		let result = parents.map(parent => {
			let history = parent.toHistory (Rates)
			history.Details = childs
				.filter (child => {
					return parent.getId () === child.getParent ()
				})
				.map (child => {
					return child.toHistory (Rates)
				})
				return history
		})

		return result
	}
}
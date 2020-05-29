import { TierRepositoryInterface } from '../../RepositoryInterface/tier.repositoryinterface'
import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { TierHistoryRepositoryInterface } from '../../RepositoryInterface/tierhistory.repositoryinterface'
import { TierService } from '../../Service/tier.service'

export class SchedulerUpgradeTierUsecase {

	protected TierRepo: TierRepositoryInterface
	protected MemberRepo: MemberRepositoryInterface
	protected HistoryRepo: TierHistoryRepositoryInterface

	constructor (
		TierRepo: TierRepositoryInterface,
		MemberRepo: MemberRepositoryInterface,
		HistoryRepo: TierHistoryRepositoryInterface
	) {
		this.TierRepo = TierRepo
		this.MemberRepo = MemberRepo
		this.HistoryRepo = HistoryRepo
	}

	public async execute (Limit: number): Promise <number> {
		let Tiers = await this.TierRepo.findByYear (new Date ().getFullYear ())
		let service = new TierService (this.MemberRepo, this.HistoryRepo, Tiers)
		let criteria = service.getMemberUpgradeCriteria ()
		let members = await this.MemberRepo.findForTierCalculation (criteria, Limit)

		let upgradeMembers = members.map(member => {
			return service.Upgrade (member)
		})

		return Promise.all(upgradeMembers).then(proccessed => {
			return proccessed.filter (status => {
				return true === status
			}).length
		})

	}

}
import { MemberRepositoryInterface } from '../RepositoryInterface/member.repositoryinterface'
import { TierHistoryRepositoryInterface } from '../RepositoryInterface/tierhistory.repositoryinterface'

import { TierAggregateRoot } from '../AggregateRoot/tier.aggregateroot'
import { MemberEntity } from '../Entity/member.entity'
import { TierHistoryEntity } from '../Entity/tierhistory.entity'

export class TierService {

	protected MemberRepo: MemberRepositoryInterface
	protected HistoryRepo: TierHistoryRepositoryInterface
	protected Tiers:TierAggregateRoot []

	constructor (
		MemberRepo: MemberRepositoryInterface,
		HistoryRepo: TierHistoryRepositoryInterface,
		Tiers: TierAggregateRoot []
	) {
		this.MemberRepo = MemberRepo
		this.HistoryRepo = HistoryRepo
		this.Tiers = Tiers
	}

	public getMemberDowngradeCriteria () {
		var bottomTier = this.getBottomTier ()
		return {
			OR: this.Tiers
			.filter (tier => {
				return tier != bottomTier
			})
			.map (tier => {
				return tier.toDowngradeCriteria ()
			})
		}
	}

	public getMemberUpgradeCriteria () {
		var bottomTier = this.getBottomTier ()
		return {
			OR: this.Tiers
			.filter (tier => {
				return tier != bottomTier
			})
			.map (tier => {
				let LowerLevelTierIDs: number [] = this.Tiers
				.filter (t => {
					return t.getLevel () < tier.getLevel ()
				})
				.map (t => {
					return t.getId ()
				})
				return tier.toUpgradeCriteria (LowerLevelTierIDs)
			})
		}
	}

	public async Upgrade (Member: MemberEntity): Promise <boolean> {
		let history = this.generateHistory (Member)
		let currentLevel = this.getTierLevelById (Member.getTier ())
		let nextLevel = this.getTierLevelById (history.getNextTier ())
		if ( currentLevel < nextLevel ) return await this.save (Member, history)
		else return false
	}

	public async Downgrade (Member: MemberEntity): Promise <boolean> {
		let history = this.generateHistory (Member)
		let currentLevel = this.getTierLevelById (Member.getTier ())
		let nextLevel = this.getTierLevelById (history.getNextTier ())
		if ( currentLevel > nextLevel ) return await this.save (Member, history)
		else return false
	}

	private generateHistory (Member: MemberEntity): TierHistoryEntity {
		var proposedHistories: TierHistoryEntity [] = []

		this.Tiers.forEach (tier => {
			tier.getQualifications().forEach (qualification => {
				let { MemberField, ThresholdValue } = qualification.toSimpleJSON ()
				let FieldValue = Member.getTierCalculationFieldValue (MemberField)
				if (FieldValue >= ThresholdValue) {
					let history = new TierHistoryEntity ()
					history.create ({
						Member: Member.getId (),
						PreviousTier: Member.getTier (),
						NextTier: tier.getId (),
						MemberField,
						FieldValue
					})
					proposedHistories.push (history)
				}
			})
		})

		proposedHistories.sort ((historyA, historyB) => {
			return this.getTierLevelById (historyB.getNextTier ()) - this.getTierLevelById (historyA.getNextTier ())
		})
		var proposedTierId = proposedHistories[0].getNextTier()
		var chosenHistories= proposedHistories
		.filter(history => {
			return history.getNextTier () === proposedTierId
		})
		.sort ((historyA, historyB) => {
			return historyB.getFieldValue () - historyA.getFieldValue ()
		})

		return chosenHistories[0]
	}

	private getBottomTier (): TierAggregateRoot {
		return this.Tiers.sort ((a,b) => {
			return a.getLevel () - b.getLevel ()
		})[0]
	}

	private getTierLevelById (Id: number): number {
		return this.Tiers.filter (tier => {
			return tier.getId () === Id
		})[0].getLevel ()
	}

	private async save (Member: MemberEntity, History: TierHistoryEntity): Promise <boolean> {
		Member.setTier (History)
		return Promise.all ([
			this.MemberRepo.save (Member),
			this.HistoryRepo.insert (History)
		])
		.then (() => {
			return true
		})
	}

}
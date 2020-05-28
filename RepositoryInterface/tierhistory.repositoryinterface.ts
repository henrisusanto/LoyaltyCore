import { TierHistoryEntity } from '../Entity/tierhistory.entity'

export interface TierHistoryRepositoryInterface {
	insert (data: TierHistoryEntity): Promise <number>
}
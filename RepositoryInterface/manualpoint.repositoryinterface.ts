import { ManualPointAggregateRoot } from '../AggregateRoot/manualpoint.aggregateroot'

export interface ManualPointRepositoryInterface {
	insert (data: ManualPointAggregateRoot): Promise <number>
}
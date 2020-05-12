import { ManualPointAggregateRoot } from '../AggregateRoot/manualpoint.aggregateroot'

export interface ManualPointRepositoryInterface {
	generateId (): Promise <number>
	insert (data: ManualPointAggregateRoot): Promise <number>
}
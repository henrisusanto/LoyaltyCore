import { LifetimePointAggregateRoot } from '../AggregateRoot/lifetimepoint.aggregateroot'

export interface LifetimePointRepositoryInterface {
	findAvailableByMember (member: number): Promise <LifetimePointAggregateRoot []> // WHERE `available` > 0
	bulkSave (data: LifetimePointAggregateRoot []): Promise <number []>
}
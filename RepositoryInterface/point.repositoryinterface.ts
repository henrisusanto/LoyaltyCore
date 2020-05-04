import { PointHeaderAggregateRoot } from '../AggregateRoot/pointheader.aggregateroot'

export interface PointRepositoryInterface {
	generateId (): Promise <number>;
	save (data: PointHeaderAggregateRoot): Promise <number>;
}
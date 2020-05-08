import { PointHeaderAggregateRoot } from '../AggregateRoot/pointheader.aggregateroot'

export interface PointRepositoryInterface {
	generateId (): Promise <number>;
	insert (data: PointHeaderAggregateRoot): Promise <number>;
	publishEventAfterInsertPoint (data: PointHeaderAggregateRoot): void;
}
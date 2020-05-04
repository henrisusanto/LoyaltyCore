import { TierAggregateRoot } from '../AggregateRoot/tier.aggregateroot'

export interface TierRepositoryInterface {
	generateId (): Promise <number>;
	save (data: TierAggregateRoot): Promise <number>;
	findByYear (year: number): Promise <TierAggregateRoot[]>;
	deleteByYear (year: number): Promise <void>;
	deleteQualifications (TierId: number): Promise <void>;
}
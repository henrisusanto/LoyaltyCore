import { PointEntity } from '../Entity/point.entity'

export interface PointRepositoryInterface {
	SummarizeYTDPointByMember (Member: number): Promise <number>
	SummarizeLifetimePointByMember (Member: number): Promise <number>
	findLifetimeRemainingGreaterThan0SortByTime (Member: number): Promise <PointEntity []>
	bulkSave (points: PointEntity []): Promise <number []>
	findLifetimeGreaterThan0HasNoParentSortByTime (Member: number): Promise <PointEntity []>
	findPointByParentIds (ParentIDs: number[]): Promise <PointEntity []>
}
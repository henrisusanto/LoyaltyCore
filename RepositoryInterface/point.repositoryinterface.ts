import { PointEntity } from '../Entity/point.entity'

export interface PointReportParameter {
	Limit: number
	Offset: number
	Since: Date
	Until: Date
}

export interface PointRepositoryInterface {
	SummarizeYTDPointByMember (Member: number): Promise <number>
	SummarizeLifetimePointByMember (Member: number): Promise <number>
	findLifetimeRemainingGreaterThan0SortByTime (Member: number): Promise <PointEntity []>
	bulkSave (points: PointEntity []): Promise <number []>
	findLifetimeGreaterThan0HasNoParentSortByTime (Member: number): Promise <PointEntity []>
	findPointByParentIds (ParentIDs: number[]): Promise <PointEntity []>
	findLifetimePointGreaterThan0SortByTime (parameter: PointReportParameter): Promise <{TotalRecord: number, TotalPoint: number, Result: PointEntity []}>
}
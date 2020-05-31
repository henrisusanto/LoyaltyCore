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
	findHistory (criteria: {}): Promise <PointEntity []>
	bulkSave (points: PointEntity []): Promise <number []>
	findLifetimePointGreaterThan0SortByTime (parameter: PointReportParameter): Promise <{TotalRecord: number, TotalPoint: number, Result: PointEntity []}>
	findLifetimePointLessThan0SortByTime (parameter: PointReportParameter): Promise <{TotalRecord: number, TotalPoint: number, Result: PointEntity []}>
	getDistinctMemberExpiredPoint (Limit: number, ExpiredCriteria: {}): Promise <number []>
	getExpiredByMembers (Member: number [], ExpiredCriteria: {}): Promise <PointEntity []>
}
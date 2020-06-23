import { PointEntity } from '../Entity/point.entity'

export interface PointReportParameter {
	Limit: number
	Offset: number
	Since: Date
	Until: Date
}

export interface PointRepositoryInterface {
	findPointToUse (parameter: {}): Promise <PointEntity []>
	findHistory (criteria: {}): Promise <PointEntity []>
	save (points: PointEntity): Promise <number>
	findLifetimePointGreaterThan0SortByTime (parameter: PointReportParameter): Promise <{TotalRecord: number, TotalPoint: number, Result: PointEntity []}>
	findLifetimePointLessThan0SortByTime (parameter: PointReportParameter): Promise <{TotalRecord: number, TotalPoint: number, Result: PointEntity []}>
	getDistinctMemberExpiredPoint (Limit: number, ExpiredCriteria: {}): Promise <number []>
	getExpiredByMembers (Member: number [], ExpiredCriteria: {}): Promise <PointEntity []>
	findByReference (data: {Reference: number, Activity: string}): Promise <PointEntity>
	findByReferences (data: {Activity: string, References: number[]}): Promise <PointEntity[]>
	findByParents (Parents: number[]): Promise <PointEntity[]>
	delete (Id: number): Promise <boolean>
}
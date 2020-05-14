import { YTDPointEntity } from '../Entity/ytdpoint.entity'

export interface YTDPointRepositoryInterface {
	findCurrentYearByMember (Member: number): Promise <YTDPointEntity []>
	bulkInsert (data: YTDPointEntity []): Promise <number []>
}
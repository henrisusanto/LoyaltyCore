import { YTDPointEntity } from '../Entity/ytdpoint.entity'
import { LifetimePointInEntity } from '../Entity/lifetimepointin.entity'
import { LifetimepointOutEntity } from '../Entity/lifetimepointout.entity'

interface LifetimePointCriteria {
	Member: number
	AvailableGreaterThan: number
	SortBy: string
	MaxDateIn: Date
}

export interface PointRepositoryInterface {
	YTDPointInsert (data: YTDPointEntity): Promise <number>
	LifetimePointInSave (data: LifetimePointInEntity): Promise <number>
	LifetimePointOutInsert (data: LifetimepointOutEntity): Promise <number>
	GetYTDPointsByMember (member: number): Promise <YTDPointEntity[]>
	GetLifetimePoints (criteria: LifetimePointCriteria): Promise <LifetimePointInEntity[]>
}
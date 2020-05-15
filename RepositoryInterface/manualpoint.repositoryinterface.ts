import { ManualPointEntity } from '../Entity/manualpoint.entity'

export interface ManualPointRepositoryInterface {
	generateId (): Promise <number>
	insert (data: ManualPointEntity): Promise <number>
}
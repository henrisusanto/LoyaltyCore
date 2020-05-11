import { ManualPointEntity } from '../Entity/manualpoint.entity'

export interface ManualPointRepositoryInterface {
	insert (data: ManualPointEntity): Promise <number>
	generateId (): Promise <number>
}
import { ManualPointEntity } from '../Entity/manualpoint.entity'

export interface ManualPointRepositoryInterface {
	insert (data: ManualPointEntity): Promise <number>
	triggerAfterInsertManualPoint (data: ManualPointEntity, Id: number): void
}
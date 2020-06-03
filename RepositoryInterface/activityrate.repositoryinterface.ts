import { ActivityRateEntity } from '../Entity/activityrate.entity'

export interface ActivityRateRepositoryInterface {
	getAll (): Promise <ActivityRateEntity []>
	findByCode (Code: string): Promise <ActivityRateEntity>
	update (data: ActivityRateEntity): Promise <string>
}
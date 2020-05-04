import { ConfigEntity } from '../Entity/config.entity'

export interface ConfigRepositoryInterface {
	save (data: ConfigEntity): Promise <string>;
	findByName (name: string): Promise <ConfigEntity>;
}
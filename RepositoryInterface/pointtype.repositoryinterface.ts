import { PointTypeEntity } from '../Entity/pointtype.entity'

export interface PointTypeRepositoryInterface {
	getAll (): Promise <PointTypeEntity []>
	findByCode (Code: string): Promise <PointTypeEntity>
	findByCodes (Codes: string[]): Promise <PointTypeEntity[]>
	update (data: PointTypeEntity): Promise <string>
}
import { MemberPointEntity } from '../Entity/memberpoint.entity'

export interface MemberPointRepositoryInterface {
	getSUMYTDbyMember (Member: number): Promise <number>
	getSUMLifetimeByMember (Member: number): Promise <number>
	bulkInsert (data: MemberPointEntity[]): Promise <number []>
	triggerAfterInsertMemberPoint (data: MemberPointEntity): void
	getLifetimeMemberPointHasNoParentSortByTimeByMember (Member: number): Promise <MemberPointEntity []>
	getMemberPointListByIds (IDs: number []): Promise <MemberPointEntity []>
}
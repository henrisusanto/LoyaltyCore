import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { EventUpdateMemberPointUseCase } from '../../UseCase/Member/event.updatememberpoint.usecase'
import { PointHeaderAggregateRoot } from '../../AggregateRoot/pointheader.aggregateroot'

export interface UpdateMemberPointEventHandlerInterface {
	callUseCase (pointHeader: PointHeaderAggregateRoot): Promise <{repo: MemberRepositoryInterface, usecase: EventUpdateMemberPointUseCase}>;
}
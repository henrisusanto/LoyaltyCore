import { DomainEvent } from './domainevent.staticclass'
import { UpdateMemberPointEventHandlerInterface } from './EventHandlerInterface/updatememberpoint.eventhandlerinterface'

export class LoyaltyCoreEventRegister {

	protected updateMemberPointEventHandler: UpdateMemberPointEventHandlerInterface

	public constructor (
		updateMemberPointEventHandler: UpdateMemberPointEventHandlerInterface
	) {
		this.updateMemberPointEventHandler = updateMemberPointEventHandler
	}


	public register () {

		// after insert point, update member.point
		DomainEvent.subscribe ('AfterInsertPoint', async (pointHeader) => {
			await this.updateMemberPointEventHandler.callUseCase (pointHeader)
		})

	}

}

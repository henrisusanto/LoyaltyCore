import { ManualPointRepositoryInterface } from '../../RepositoryInterface/manualpoint.repositoryinterface'
import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { YTDPointRepositoryInterface } from '../../RepositoryInterface/ytdpoint.repositoryinterface'
import { LifetimePointRepositoryInterface } from '../../RepositoryInterface/lifetimepoint.repositoryinterface'
import { MemberPointService } from '../../Service/memberpoint.service'
import { ManualPointEntity } from '../../Entity/manualpoint.entity'

export class ClientSendPointUsecase {
	protected manualPointRepo: ManualPointRepositoryInterface
	protected memberRepo: MemberRepositoryInterface
	protected YTDPointRepo: YTDPointRepositoryInterface
	protected LifetimePointRepo: LifetimePointRepositoryInterface

	constructor (
		manualPointRepo: ManualPointRepositoryInterface,
		memberRepo: MemberRepositoryInterface,
		YTDPointRepo: YTDPointRepositoryInterface,
		LifetimePointRepo: LifetimePointRepositoryInterface
	) {
		this.manualPointRepo = manualPointRepo
		this.memberRepo = memberRepo
		this.YTDPointRepo = YTDPointRepo
		this.LifetimePointRepo = LifetimePointRepo
	}

	public async execute (
		Member: number,
		YTD?: number,
		Lifetime?: number,
		LifetimeDateIn?: Date,
		Remarks?: string
	): Promise <number> {
		try {
			const manualPointId = await this.manualPointRepo.generateId ()
			let manual = new ManualPointEntity ()
			manual.create (manualPointId, Member, YTD, Lifetime, LifetimeDateIn, Remarks)

			let memberPoint = new MemberPointService (
				this.memberRepo,
				this.YTDPointRepo,
				this.LifetimePointRepo
			)

			await memberPoint.setMember (Member)
			if (YTD && YTD > 0) await memberPoint.addYTD (YTD, 'MANUAL_ADD', manualPointId, Remarks || '')
			if (YTD && YTD < 0) await memberPoint.deductYTD (YTD, 'MANUAL_DEDUCT', manualPointId, Remarks || '')

			if (Lifetime && Lifetime > 0) await memberPoint.addLifetime (Lifetime, 'MANUAL_ADD', manualPointId, Remarks || '')
			if (Lifetime && Lifetime < 0) await memberPoint.deductLifetime (Lifetime, 'MANUAL_DEDUCT', manualPointId, Remarks || '')

			await memberPoint.save ()
			return await this.manualPointRepo.insert (manual)
		} catch (e) {
			throw new Error (e)
		}

	}

}
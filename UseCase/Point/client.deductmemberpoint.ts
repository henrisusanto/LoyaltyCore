import { ManualPointRepositoryInterface } from '../../RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointEntity } from '../../Entity/manualpoint.entity'

import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { PointService } from '../../Service/point.service'

export class ClientDeductMemberPointUsecase {

	protected ManualRepo: ManualPointRepositoryInterface
	protected PointRepo: PointRepositoryInterface
	protected MemberRepo: MemberRepositoryInterface

	constructor (
		ManualRepo: ManualPointRepositoryInterface,
		PointRepo: PointRepositoryInterface,
		MemberRepo: MemberRepositoryInterface
	) {
		this.ManualRepo = ManualRepo
		this.PointRepo = PointRepo
		this.MemberRepo = MemberRepo
	}

	public async execute (
		Member: number,
		YTD?: number,
		Lifetime?: number,
		Remarks?: string
	): Promise <number> {

		YTD = YTD && YTD > 0 ? YTD * -1 : YTD
		Lifetime = Lifetime && Lifetime > 0 ? Lifetime * -1 : Lifetime
		try {
			const Id = await this.ManualRepo.generateId ()
			let manual = new ManualPointEntity ()
			manual.create (Id, Member, YTD, Lifetime, new Date(), Remarks)

			let service = new PointService (this.MemberRepo, this.PointRepo)
			await service.spend ({
				Member,
				Time: new Date (),
				Activity: 'MANUAL_DEDUCT',
				Reference: Id,
				YTDAmount: YTD || 0,
				LifetimeAmount: Lifetime || 0,
				Remarks: Remarks || ''
			})

			let saved = await this.ManualRepo.insert (manual)
			service.save ()
			return saved
		} catch (e) {
			throw new Error (e)
		}

	}

}
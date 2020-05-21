import { ManualPointRepositoryInterface } from '../../RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointEntity } from '../../Entity/manualpoint.entity'

import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { PointService } from '../../Service/point.service'

export class ClientAddMemberPointUsecase {

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
		LifetimeDateIn?: Date,
		Remarks?: string
	): Promise <number> {

		if (YTD) YTD = Math.abs (YTD)
		if (Lifetime) Lifetime = Math.abs (Lifetime)
		try {
			const Id = await this.ManualRepo.generateId ()
			let manual = new ManualPointEntity ()
			manual.create (Id, Member, YTD, Lifetime, LifetimeDateIn, Remarks)

			let service = new PointService (this.MemberRepo, this.PointRepo)
			await service.earn ({
				Member,
				Time: LifetimeDateIn || new Date (),
				Activity: 'MANUAL_ADD',
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
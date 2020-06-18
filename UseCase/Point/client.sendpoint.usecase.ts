import { ManualPointRepositoryInterface } from '../../RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointEntity } from '../../Entity/manualpoint.entity'

import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../RepositoryInterface/pointtype.repositoryinterface'
import { PointService } from '../../Service/point.service'

export class ClientSendPointUsecase {

	protected ManualRepo: ManualPointRepositoryInterface
	protected MemberRepo: MemberRepositoryInterface
	protected PointRepo: PointRepositoryInterface
	protected RateRepo: PointTypeRepositoryInterface

	constructor (
		ManualRepo: ManualPointRepositoryInterface,
		MemberRepo: MemberRepositoryInterface,
		PointRepo: PointRepositoryInterface,
		RateRepo: PointTypeRepositoryInterface
	) {
		this.ManualRepo = ManualRepo
		this.MemberRepo = MemberRepo
		this.PointRepo = PointRepo
		this.RateRepo = RateRepo
	}

	public async execute (Member: number, YTD ?: number, Lifetime ?: number, LifetimeDateIn ?: Date, Remarks ?: string): Promise <number> {
		try {
			let Id = await this.ManualRepo.generateId ()

			let ManualPoint = new ManualPointEntity ()
			ManualPoint.create ({
				Id,
				Member,
				YTD,
				Lifetime,
				LifetimeDateIn,
				Remarks
			})

			let service = new PointService (
				this.MemberRepo,
				this.PointRepo,
				this.RateRepo
			)
			let MemberEntity = await this.MemberRepo.findOne (Member)
			let Rate = await this.RateRepo.findByCode ('MANUAL')

			await service.manual ({
				Member: MemberEntity,
				Rate,
				ManualId: Id,
				YTD : YTD || 0,
				Lifetime : Lifetime || 0,
				Time: LifetimeDateIn,
				Remarks
			})
			return await this.ManualRepo.insert (ManualPoint)
		} catch (e) {
			throw new Error (e)
		}
	}

}
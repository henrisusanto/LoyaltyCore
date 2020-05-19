import { ManualPointRepositoryInterface } from '../../RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointEntity } from '../../Entity/manualpoint.entity'

import { MemberPointRepositoryInterface } from '../../RepositoryInterface/memberpoint.repositoryinterface'
import { MemberPointEntity } from '../../Entity/memberpoint.entity'

export class ClientSendPointUsecase {
	protected manualPointRepo: ManualPointRepositoryInterface
	protected memberPointRepo: MemberPointRepositoryInterface

	constructor (
		manualPointRepo: ManualPointRepositoryInterface,
		memberPointRepo: MemberPointRepositoryInterface
	) {
		this.manualPointRepo = manualPointRepo
		this.memberPointRepo= memberPointRepo
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

			if (YTD && YTD < 0) {
				if (Math.abs (YTD) > await this.memberPointRepo.getSUMYTDbyMember (Member)) {
					throw new Error ('Insufficient YTD Point')
				}
			}

			if (Lifetime && Lifetime < 0) {
				if (Math.abs (Lifetime) > await this.memberPointRepo.getSUMLifetimeByMember (Member)) {
					throw new Error ('Insufficient Lifetime Point')
				}
			}

			let points: MemberPointEntity[] = []
			if (YTD) {
				let point = new MemberPointEntity ()
				point.create ({
					Member,
					PointType: 'YTD',
					Amount: YTD,
					Time: new Date (),
					Activity: YTD > 0 ? 'MANUAL_ADD' : 'MANUAL_DEDUCT',
					Reference: manualPointId,
					Remarks: Remarks || ''
				})
				points.push (point)
			}
			if (Lifetime) {
				let point = new MemberPointEntity ()
				point.create ({
					Member,
					PointType: 'Lifetime',
					Amount: Lifetime,
					Time: LifetimeDateIn || new Date (),
					Activity: Lifetime > 0 ? 'MANUAL_ADD' : 'MANUAL_DEDUCT',
					Reference: manualPointId,
					Remarks: Remarks || ''
				})
				points.push (point)
			}
			this.memberPointRepo.bulkInsert (points)

			return await this.manualPointRepo.insert (manual)
		} catch (e) {
			throw new Error (e)
		}

	}

}
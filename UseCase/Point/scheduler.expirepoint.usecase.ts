import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../RepositoryInterface/pointtype.repositoryinterface'
import { PointService } from '../../Service/point.service'

export class SchedulerExpirePoints {

	protected PointRepo: PointRepositoryInterface
	protected MemberRepo: MemberRepositoryInterface
	protected PointTypeRepo: PointTypeRepositoryInterface

	constructor (
		PointRepo: PointRepositoryInterface,
		MemberRepo: MemberRepositoryInterface,
		PointTypeRepo: PointTypeRepositoryInterface
	) {
		this.PointRepo = PointRepo
		this.MemberRepo = MemberRepo
		this.PointTypeRepo = PointTypeRepo
	}

	public async execute (Limit: number): Promise <number> {
		try {
			let ExpiredCriteria = {
				AND: [
					{
						Field: 'LifetimeRemaining',
						Operator: '>',
						FieldValue: 0
					},
					{
						Field: 'LifetimeExpiredDate',
						Operator: '<=',
						FieldValue: 'CURRENT_DATE()'
					},
				]
			}

			let MemberIDs = await this.PointRepo.getDistinctMemberExpiredPoint (Limit, ExpiredCriteria)
			if (MemberIDs.length < 1) return 0

			var Points = await this.PointRepo.getExpiredByMembers (MemberIDs, ExpiredCriteria)
			var Members = await this.MemberRepo.findByIDs (MemberIDs)
			var Rate = await this.PointTypeRepo.findByCode ('EXPIRED')

			Members.forEach (async Member => {
				let Expireds= Points.filter (point => point.getMember () === Member.getId ())
				if (Expireds.length > 0) {
					let service = new PointService (this.MemberRepo, this.PointRepo, this.PointTypeRepo)
					await service.expire (Member, Expireds, Rate)
				}
			})

			return Members.length
		} catch (e) {
			throw new Error (e)
		}

	}

}
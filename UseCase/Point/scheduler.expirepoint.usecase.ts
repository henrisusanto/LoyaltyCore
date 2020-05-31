import { PointRepositoryInterface } from '../../RepositoryInterface/point.repositoryinterface'
import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { PointService } from '../../Service/point.service'
import { MemberEntity } from '../../Entity/member.entity'

export class SchedulerExpirePoints {

	protected PointRepo: PointRepositoryInterface
	protected MemberRepo: MemberRepositoryInterface

	constructor (
		PointRepo: PointRepositoryInterface,
		MemberRepo: MemberRepositoryInterface
	) {
		this.PointRepo = PointRepo
		this.MemberRepo = MemberRepo
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
			let Points = await this.PointRepo.getExpiredByMembers (MemberIDs, ExpiredCriteria)
			let Members = await this.MemberRepo.findByIDs (MemberIDs)
			var Deferred: Promise <void>[] = []
			Members.forEach (member => {
				let expireds= Points.filter (point => point.getMember () === member.getId ())
				if (expireds.length > 0) {
					let service = new PointService (this.MemberRepo, this.PointRepo)
					service.expire (member, expireds)
					Deferred.push (service.save ())
				}
			})

			return Promise
			.all(Deferred)
			.then(() => {
				return Deferred.length
			})
		} catch (e) {
			throw new Error (e)
		}

	}

}
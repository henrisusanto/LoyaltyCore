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

	public async execute (): Promise <boolean> {
		try {
			let Expireds = await this.PointRepo.getRemainingGT0ExpiredDateLTEtoday ()
			let IDs: number [] = Expireds
				.map (point => point.getMember ())
	  		.filter ((value, index, self) => self.indexOf(value) === index)

	  	var MemberPromises: Promise <MemberEntity> [] = []
	  	IDs.forEach (id => {
	  		MemberPromises.push (this.MemberRepo.findOne (id))
	  	})

	  	Promise.all(MemberPromises).then(Members => {
		  	var Services: PointService[] = []
		  	Members.forEach (member => {
					let expireds= Expireds.filter (point => point.getMember () === member.getId ())
					if (expireds.length > 0) {
						let service = new PointService (this.MemberRepo, this.PointRepo)
						service.expire (member, expireds)
						Services.push (service)
					}
		  	})

				Services.forEach(service => {
					service.save ()
				})
	  	})

			return true
		} catch (e) {
			throw new Error (e)
		}

	}

}
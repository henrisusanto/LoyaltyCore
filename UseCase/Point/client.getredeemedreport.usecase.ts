import { PointRepositoryInterface, PointReportParameter } from '../../RepositoryInterface/point.repositoryinterface'
import { ActivityRateRepositoryInterface } from '../../RepositoryInterface/activityrate.repositoryinterface'
import { MemberRepositoryInterface } from '../../RepositoryInterface/member.repositoryinterface'
import { PointEntity  } from '../../Entity/point.entity'

export class ClientGetRedeemedReport {
	protected repo: PointRepositoryInterface
	protected rateRepo: ActivityRateRepositoryInterface
	protected memberRepo: MemberRepositoryInterface

	public constructor (
		repo: PointRepositoryInterface,
		rateRepo: ActivityRateRepositoryInterface,
		memberRepo: MemberRepositoryInterface
	) {
		this.repo = repo
		this.rateRepo = rateRepo
		this.memberRepo = memberRepo
	}

	public async execute (RecordPerPage: number, CurrentPage: number, Since: Date, Until: Date) {
    RecordPerPage = RecordPerPage || 5
    CurrentPage = CurrentPage || 1
    const parameter: PointReportParameter = {
      Limit: RecordPerPage,
      Offset: (CurrentPage - 1) * RecordPerPage,
      Since,
      Until
    }

		let rates = await this.rateRepo.getAll ()
		var Rates = {}
		rates.forEach (rate => {
			let { Code, Description } = rate.toHistory ()
			Rates[Code] = Description
		})

		const { TotalRecord, TotalPoint, Result } = await this.repo.findLifetimePointLessThan0SortByTime (parameter)

		let MemberIds: number[] = Result
			.map (point => point.getMember ())
		  .filter((value, index, self) => self.indexOf(value) === index)
		let Members = await this.memberRepo.findByIDs (MemberIds)
		let MemberNames: string [] = []
		Members.forEach (member => {
			MemberNames[member.getId ()] = member.getFullName ()
		})

		let reportJSON = {
			Limit: parameter.Limit.toString (),
			Offset: parameter.Offset.toString (),
			TotalRecord,
			TotalPoint: Math.abs (TotalPoint).toString (),
			Records: Result.map (res => {
				return res.toReport (Rates, MemberNames)
			})
		}

		return reportJSON
	}

}
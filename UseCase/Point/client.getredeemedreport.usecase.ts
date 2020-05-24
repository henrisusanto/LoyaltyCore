import { PointRepositoryInterface, PointReportParameter } from '../../RepositoryInterface/point.repositoryinterface'
import { PointEntity  } from '../../Entity/point.entity'

export class ClientGetRedeemedReport {
	protected repo: PointRepositoryInterface

	public constructor (repo: PointRepositoryInterface) {
		this.repo = repo
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

		const { TotalRecord, TotalPoint, Result } = await this.repo.findLifetimePointLessThan0SortByTime (parameter)
		let reportJSON = {
			Limit: parameter.Limit.toString (),
			Offset: parameter.Offset.toString (),
			TotalRecord,
			TotalPoint: Math.abs (TotalPoint).toString (),
			Records: Result.map (res => {
				return res.toReport ()
			})
		}

		return reportJSON
	}

}
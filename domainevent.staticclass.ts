
export class DomainEvent {

  private static Publisher = {}

  public static subscribe ( PublisherName: string, subscriber: any ): void {
  	if ( this.Publisher[PublisherName] ) this.Publisher[PublisherName].Subscribers.push ( subscriber )
  	else {
  		this.Publisher[PublisherName] = {
  			Subscribers: [ subscriber ]
  		}
  	}
  }

  public static publish ( Name: string, DomainModelData: any ): void {
  	if ( this.Publisher[Name] ) for ( let subs of this.Publisher[Name].Subscribers ) {
  		subs ( DomainModelData )
  	}
  }

}
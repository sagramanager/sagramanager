export class Order {

  constructor(
    public customer: string,
    public places: number,
    public tableNumber: number,
    public waiter: string,
    public notes: string,
    public takeAway: boolean
  ) {  }

}
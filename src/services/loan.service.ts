export class LoanService {
    constructor(private readonly dataSource: any) {}

    public async createLoan(data: any) {
        return this.dataSource.create(data);
    }
}
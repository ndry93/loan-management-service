import { NextFunction, Request, Response, Router } from 'express';
import { LoanService } from 'src/services/loan.service';

export class LoanController {
    private readonly router: Router;

    public constructor(private readonly loanService: LoanService) {
        this.router = Router();

        this.router.post('/', this.createLoan.bind(this));
    }

    getRouter() {
        return this.router;
    }

    public async createLoan(req: Request, res: Response, next: NextFunction) {
        const { data } = req.body;
        try {
            const result = await this.loanService.createLoan(data);
            res.locals.data = result;
            return next();
        } catch (e) {
            return next(e);
        }
    }
}

import assert from 'assert';
import { NextFunction, Request, Response, Router } from 'express';
import { ErrorCodeMap } from 'src/errors';
import { LoanService } from 'src/services/loan.service';
import { StandardError } from 'src/standard-error';

export class LoanController {
    private readonly router: Router;

    public constructor(private readonly loanService: LoanService) {
        this.router = Router();

        this.router.post('/', this.createLoan.bind(this));
        this.router.post('/:id/approve', this.validateLoanId, this.approveLoan.bind(this));
        // this.router.post('/:id/disburse', this.disburseLoan.bind(this)); // not yet implemented
        // this.router.post('/:id/invest', this.investLoan.bind(this)); // not yet implemented
    }

    getRouter() {
        return this.router;
    }

    // eslint-disable-next-line consistent-return, class-methods-use-this
    validateLoanId = (req: Request, res: Response, next: NextFunction) => {
        const loanId = req.params.id;
        if (!loanId) {
            return res.status(400).json({ message: 'Loan ID is required' });
        }
        next();
    };

    public async createLoan(req: Request, res: Response) {
        try {
            const { data } = req.body;
            assert(data, 'data is required');
            const result = await this.loanService.createLoan(data);
            res.json(result);
        } catch (error) {
            // catch error StandardError
            if (error instanceof StandardError) {
                res.status(ErrorCodeMap[error.error_code]).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    public async approveLoan(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data } = req.body;

            assert(id, 'loan id is required');
            assert(data, 'data is required');
            const result = await this.loanService.approveLoan(id, data);
            res.json(result);
        } catch (error) {
            // catch error StandardError
            if (error instanceof StandardError) {
                res.status(ErrorCodeMap[error.error_code]).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    // public async investLoan(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;
    //         const { data } = req.body;

    //         assert(id, 'loan id is required');
    //         assert(data, 'data is required');
    //         const result = await this.loanService.investLoan(id, data);
    //         res.json(result);
    //     } catch (error) {
    //         // catch error StandardError
    //         if (error instanceof StandardError) {
    //             res.status(ErrorCodeMap[error.error_code]).json({ message: error.message });
    //         } else {
    //             res.status(500).json({ message: error.message });
    //         }
    //     }
    // }

    // public async disburseLoan(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;
    //         const { data } = req.body;

    //         assert(id, 'loan id is required');
    //         assert(data, 'data is required');
    //         const result = await this.loanService.disburseLoan(id, data);
    //         res.json(result);
    //     } catch (error) {
    //         // catch error StandardError
    //         if (error instanceof StandardError) {
    //             res.status(ErrorCodeMap[error.error_code]).json({ message: error.message });
    //         } else {
    //             res.status(500).json({ message: error.message });
    //         }
    //     }
    // }
}

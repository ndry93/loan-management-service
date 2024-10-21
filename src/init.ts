import 'reflect-metadata'; // for TypeORM
import { connect } from './db-connect';
import { LoanController } from './controllers/loan.controller';
import { LoanService } from './services/loan.service';

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers, queue runners and crons
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init() {
    // repositories
    const dataSource = await connect();

    // services
    const loanService = new LoanService(dataSource);

    // controllers
    const loanController = new LoanController(loanService);

    return {
        dataSource,

        loanService,
        loanController
    };
}

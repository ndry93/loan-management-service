import 'reflect-metadata'; // for TypeORM
import { DataSource } from 'typeorm/data-source/DataSource';
import { Repository } from 'typeorm/repository/Repository';
import { addTransactionalDataSource, initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { connect } from './db-connect';
import { LoanController } from './controllers/loan.controller';
import { LoanService } from './services/loan.service';
import { ApprovalDetail, Loan, LoanInvestment } from './models';
import { Borrower } from './models/borrower.entity';
import { DisbursementDetail } from './models/disbursement-detail.entity';
import { BorrowerService } from './services/borrower.service';

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers, queue runners and crons
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init() {
    // db
    const dataSource: DataSource = await connect();
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    addTransactionalDataSource(dataSource);

    // repositories
    const loanRepository: Repository<Loan> = dataSource.getRepository(Loan);
    const borrowerRepository: Repository<Borrower> = dataSource.getRepository(Borrower);
    const loanInvestmentRepository: Repository<LoanInvestment> = dataSource.getRepository(LoanInvestment);
    const disbursementDetailRepository: Repository<DisbursementDetail> = dataSource.getRepository(DisbursementDetail);
    const approvalDetailRepository: Repository<ApprovalDetail> = dataSource.getRepository(ApprovalDetail);

    // services
    const borrowerService = new BorrowerService(borrowerRepository);
    const loanService = new LoanService(
        loanRepository,
        borrowerService,
        loanInvestmentRepository,
        disbursementDetailRepository,
        approvalDetailRepository
    );

    // controllers
    const loanController = new LoanController(loanService);

    return {
        dataSource,

        loanService,
        loanController
    };
}

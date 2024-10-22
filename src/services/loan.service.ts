import { ApprovalDetail, Borrower, LoanInvestment } from '@src/models';
import { DisbursementDetail } from '@src/models/disbursement-detail.entity';
import { Loan } from '@src/models/loan.entity';
import { Transactional } from 'typeorm-transactional';
import { Repository } from 'typeorm/repository/Repository';
import {
    ApproveLoanRequest,
    ApproveLoanResponse,
    CreateLoanRequest,
    CreateLoanResponse
} from '@src/interfaces/loan.interface';
import { calculateInterestAmount, calculateLoanROI } from '@src/helpers/loan.helper';
import { validateUrl } from '@src/utils';
import { logger } from '@src/libs/logger';
import { LoanStatusEnum } from '@src/enums';
import { BorrowerService } from './borrower.service';

export class LoanService {
    private readonly loanRepository: Repository<Loan>;

    private readonly borrowerService: BorrowerService;

    private readonly loanInvestmentRepository: Repository<LoanInvestment>;

    private readonly disbursementDetailRepository: Repository<DisbursementDetail>;

    private readonly approvalDetailRepository: Repository<ApprovalDetail>;

    constructor(
        loanRepository: Repository<Loan>,
        borrowerService: BorrowerService,
        loanInvestmentRepository: Repository<LoanInvestment>,
        disbursementDetailRepository: Repository<DisbursementDetail>,
        approvalDetailRepository: Repository<ApprovalDetail>
    ) {
        this.loanRepository = loanRepository;
        this.borrowerService = borrowerService;
        this.loanInvestmentRepository = loanInvestmentRepository;
        this.disbursementDetailRepository = disbursementDetailRepository;
        this.approvalDetailRepository = approvalDetailRepository;
    }

    // this is just to demonstrate that we can use @Transactional decorator to initiate an atomic transaction
    // this createLoan function works without atomic transaction as well
    @Transactional()
    public async createLoan(createLoanRequest: CreateLoanRequest): Promise<CreateLoanResponse> {
        try {
            const borrower: Borrower = await this.borrowerService.getBorrower(createLoanRequest.borrower_id);
            if (!borrower) {
                throw new Error('Borrower not found');
            }

            const agreementLetterLink = validateUrl(createLoanRequest.agreement_letter_link);
            if (!agreementLetterLink) {
                throw new Error('Invalid agreement letter link');
            }

            const loan = new Loan();
            loan.borrower_id = createLoanRequest.borrower_id;
            loan.principal_amount = createLoanRequest.principal_amount;
            loan.interest_rate = createLoanRequest.interest_rate;
            loan.interest_amount = calculateInterestAmount(
                createLoanRequest.principal_amount,
                createLoanRequest.interest_rate
            );
            loan.roi = calculateLoanROI(createLoanRequest.principal_amount, loan.interest_amount);
            loan.agreement_letter_link = createLoanRequest.agreement_letter_link;
            const savedLoan: Loan = await this.loanRepository.save(loan);

            const createLoanResponse: CreateLoanResponse = {
                id: savedLoan.id,
                borrower_id: savedLoan.borrower_id,
                principal_amount: savedLoan.principal_amount,
                interest_rate: savedLoan.interest_rate,
                roi: savedLoan.roi,
                interest_amount: savedLoan.interest_amount,
                total_investment_amount: savedLoan.principal_amount + savedLoan.interest_amount,
                agreement_letter_link: savedLoan.agreement_letter_link,
                created_at: savedLoan.created_at,
                updated_at: savedLoan.updated_at,
                created_by: savedLoan.created_by,
                updated_by: savedLoan.updated_by
            };
            return createLoanResponse;
        } catch (error) {
            // actually here we should be specific to handle exceptions
            logger.error(error);
            throw error;
        }
    }

    @Transactional()
    public async approveLoan(loanId: string, approveLoanRequest: ApproveLoanRequest): Promise<ApproveLoanResponse> {
        try {
            if (!loanId) {
                throw new Error('Loan id is required');
            }
            if (!approveLoanRequest) {
                throw new Error('Approve loan request is required');
            }
            const agreementLetterLink = validateUrl(approveLoanRequest.validator_picture_url);
            if (!agreementLetterLink) {
                throw new Error('Invalid agreement letter link');
            }

            // find loan by id with pessimistic write lock
            const loan: Loan = await this.loanRepository.findOne({
                where: {
                    id: loanId
                },
                lock: {
                    mode: 'pessimistic_write'
                }
            });
            if (!loan) {
                throw new Error('Loan is not found');
            }

            const approvalDetail = new ApprovalDetail();
            approvalDetail.employee_id = approveLoanRequest.employee_id;
            approvalDetail.validator_picture_url = approveLoanRequest.validator_picture_url;
            const savedApprovalDetail = await this.approvalDetailRepository.save(approvalDetail);
            const approvalLoanResponse: ApproveLoanResponse = {
                id: savedApprovalDetail.id,
                approval_date: savedApprovalDetail.approval_date,
                employee_id: savedApprovalDetail.employee_id,
                validator_picture_url: savedApprovalDetail.validator_picture_url,
                created_at: savedApprovalDetail.created_at,
                updated_at: savedApprovalDetail.updated_at,
                created_by: savedApprovalDetail.created_by,
                updated_by: savedApprovalDetail.updated_by
            };

            // FSM validation here

            // patch status
            loan.status = LoanStatusEnum.APPROVED;
            await this.loanRepository.save(loan);

            // await this.loanRepository.update(loanId, { approval_detail_id: savedApprovalDetail.id });
            return approvalLoanResponse;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

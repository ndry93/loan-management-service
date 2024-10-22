import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { LoanStatusEnum } from 'src/enums';
import { Loan, Borrower, Employee, ApprovalDetail } from 'src/models';
import { createApp } from 'src/app';
import { ApproveLoanRequest, CreateLoanRequest } from 'src/interfaces/loan.interface';

// src/controllers/loan.controller.test.ts

/**
 * Integration tests are more important compared to unit tests
 */
describe('LoanController Integration Tests', () => {
    let app: Express.Application;
    let dataSource: DataSource;
    let loanRepository: Repository<Loan>;
    let borrowerRepository: Repository<Borrower>;
    let approvalDetailRepository: Repository<ApprovalDetail>;
    let employeeRepository: Repository<Employee>;

    beforeAll(async () => {
        const application = await createApp();
        app = application.app;
        dataSource = application.dataSource;
        loanRepository = dataSource.getRepository(Loan);
        borrowerRepository = dataSource.getRepository(Borrower);
        approvalDetailRepository = dataSource.getRepository(ApprovalDetail);
        employeeRepository = dataSource.getRepository(Employee);
    });

    afterEach(async () => {
        await approvalDetailRepository.delete({});
        await employeeRepository.delete({});
        await loanRepository.delete({});
        await borrowerRepository.delete({});
    });

    afterAll(async () => {
        if (dataSource) await dataSource.close();
    });

    describe('POST /api/v1/loans', () => {
        it('should create a new loan', async () => {
            const borrower = await borrowerRepository.save({ name: 'John Doe' });
            const loanData: CreateLoanRequest = {
                principal_amount: 1000,
                interest_rate: 5,
                borrower_id: borrower.id,
                agreement_letter_link: ''
            };

            const expectedInterestAmount = loanData.principal_amount * (loanData.interest_rate / 100);
            const expectedROI = expectedInterestAmount / loanData.principal_amount;

            const response = await request(app).post('/api/v1/loans').send({ data: loanData }).expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.principal_amount).toEqual(loanData.principal_amount);
            expect(response.body.interest_amount).toEqual(expectedInterestAmount);
            expect(response.body.roi).toEqual(expectedROI);
            expect(response.body.borrower_id).toEqual(loanData.borrower_id);
        });

        it('should return an error if data is missing', async () => {
            const response = await request(app).post('/api/v1/loans').send({}).expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/v1/loans/:id/approve', () => {
        it('should approve a loan', async () => {
            const employee = await employeeRepository.save({ name: 'Ronaldo' });
            const borrower = await borrowerRepository.save({ name: 'John Doe' });
            const loanData: CreateLoanRequest = {
                principal_amount: 1000,
                interest_rate: 12,
                borrower_id: borrower.id,
                agreement_letter_link: ''
            };

            const loanResponse = await request(app).post('/api/v1/loans').send({ data: loanData }).expect(200);

            const approvalData: ApproveLoanRequest = {
                employee_id: employee.id,
                validator_picture_url: 'https://example.com/validator.jpg'
            };

            const response = await request(app)
                .post(`/api/v1/loans/${loanResponse.body.id}/approve`)
                .send({ data: approvalData })
                .expect(200);

            expect(response.body).toHaveProperty('id');

            // here, we must check the loan status
            // .toEqual(LoanStatusEnum.APPROVED);
        });

        // eslint-disable-next-line jest/expect-expect
        it('should return an error if loan id is missing', async () => {
            await request(app).post('/api/v1/loans//approve').send({ data: {} }).expect(404);
        });
    });
});

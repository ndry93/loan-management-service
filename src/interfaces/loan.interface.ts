import { AuditableInterface } from './auditable.interface';

export type CreateLoanRequest = {
    borrower_id: string;
    principal_amount: number;
    interest_rate: number;
    agreement_letter_link: string;
};

export interface LoanData extends AuditableInterface {
    id: string;
    borrower_id: string;
    principal_amount: number;
    interest_rate: number;
    roi: number;
    interest_amount: number;
    total_investment_amount: number;
    agreement_letter_link: string;
}

export type CreateLoanResponse = LoanData;

export type ApproveLoanRequest = {
    employee_id: string;
    validator_picture_url: string;
};

export interface ApproveLoanData extends AuditableInterface {
    id: string;
    approval_date: Date;
    employee_id: string;
    validator_picture_url: string;
}

export type ApproveLoanResponse = ApproveLoanData;

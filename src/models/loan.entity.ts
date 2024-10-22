/* eslint-disable import/no-cycle */
import { Entity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation, Index } from 'typeorm';
import { LoanStatusEnum } from 'src/enums';
import { CustomBaseEntity } from './base/auditable';
import { Borrower } from './borrower.entity';
import { LoanInvestment } from './loan-investment.entity';
import { DisbursementDetail } from './disbursement-detail.entity';
import { ApprovalDetail } from './approval-detail.entity';

@Entity()
@Index(['borrower_id'])
@Index(['disbursement_detail_id'])
export class Loan extends CustomBaseEntity {
    @Column()
    borrower_id: string;

    @ManyToOne(() => Borrower, (borrower) => borrower.loans, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'borrower_id', referencedColumnName: 'id' })
    borrower: Borrower;

    @Column('decimal', { precision: 5, scale: 2 })
    interest_rate: number;

    @Column('decimal', { precision: 15, scale: 2 })
    principal_amount: number;

    @Column('decimal', { precision: 5, scale: 2 })
    roi: number;

    @Column()
    agreement_letter_link: string;

    @Column('enum', { enum: LoanStatusEnum, default: LoanStatusEnum.PROPOSED })
    status: LoanStatusEnum;

    @Column('decimal', { precision: 15, scale: 2 })
    interest_amount: number;

    @Column('decimal', { precision: 15, scale: 2, nullable: true })
    total_investment_amount?: number;

    @OneToMany(() => LoanInvestment, (loanInvestment) => loanInvestment.loan)
    investments?: LoanInvestment[];

    @Column({ nullable: true })
    disbursement_detail_id?: string;

    @OneToOne(() => DisbursementDetail, (disbursementDetail) => disbursementDetail.loan, {
        cascade: true,
        nullable: true
    })
    @JoinColumn({ name: 'disbursement_detail_id' })
    disbursementDetail?: Relation<DisbursementDetail>;

    @OneToMany(() => ApprovalDetail, (approvalDetail) => approvalDetail.loan)
    approvalDetails?: ApprovalDetail[];
}

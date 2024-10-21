/* eslint-disable import/no-cycle */
import { Entity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { Borrower } from './borrower.entity';
import { LoanInvestment } from './loan-investment.entity';
import { DisbursementDetail } from './disbursement-detail.entity';

@Entity()
export class Loan extends CustomBaseEntity {
    @Column()
    borrower_id: string;

    @ManyToOne(() => Borrower, (borrower) => borrower.loans, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'borrower_id', referencedColumnName: 'id' })
    borrower: Borrower;

    @Column({ nullable: true })
    interest_rate: string;

    @Column()
    principal_amount: string;

    @Column()
    expected_roi: string;

    @Column()
    status: string;

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
}

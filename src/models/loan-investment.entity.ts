import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { Loan } from './loan.entity';

@Entity()
export class LoanInvestment extends CustomBaseEntity {
    @Column({ nullable: true })
    loan_id: string;

    @ManyToOne(() => Loan, (loan) => loan.investments, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'loan_id' })
    loan: Loan;
}

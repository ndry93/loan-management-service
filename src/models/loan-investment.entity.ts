/* eslint-disable import/no-cycle */
import { Entity, Column, JoinColumn, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { Loan } from './loan.entity';

@Entity()
@Index(['loan_id'])
export class LoanInvestment extends CustomBaseEntity {
    @Column({ nullable: true })
    loan_id: string;

    @ManyToOne(() => Loan, (loan) => loan.investments, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'loan_id' })
    loan?: Loan;

    @CreateDateColumn({ type: 'timestamptz' })
    investment_date: Date;

    @Column()
    investor_name: string;

    @Column('decimal', { precision: 15, scale: 2 })
    invested_amount: number;
}

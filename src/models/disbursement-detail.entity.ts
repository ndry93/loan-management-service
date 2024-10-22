/* eslint-disable import/no-cycle */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { Loan } from './loan.entity';
import { Employee } from './employee.entity';

@Entity()
export class DisbursementDetail extends CustomBaseEntity {
    @OneToOne(() => Loan, (loan) => loan.disbursementDetail)
    loan?: Relation<Loan>;

    @CreateDateColumn({ type: 'timestamptz' })
    disbursement_date: Date;

    @Column()
    agreement_letter_signed_url: string;

    @Column()
    employee_id: string;

    @ManyToOne(() => Employee, (employee) => employee.disbursementDetails, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'employee_id', referencedColumnName: 'id' })
    employee?: Employee;
}

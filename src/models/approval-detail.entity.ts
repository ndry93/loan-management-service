/* eslint-disable import/no-cycle */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { Loan } from './loan.entity';
import { Employee } from './employee.entity';

@Entity()
export class ApprovalDetail extends CustomBaseEntity {
    @Column()
    loan_id: string;

    @ManyToOne(() => Loan, (loan) => loan.approvalDetails, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'loan_id', referencedColumnName: 'id' })
    loan?: Loan;

    @CreateDateColumn({ type: 'timestamptz' })
    approval_date: Date;

    @Column()
    validator_picture_url: string;

    @Column()
    employee_id: string;

    @ManyToOne(() => Employee, (employee) => employee.approvalDetails, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'employee_id', referencedColumnName: 'id' })
    employee?: Employee;
}

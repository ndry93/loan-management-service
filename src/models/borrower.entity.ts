/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { Loan } from './loan.entity';

@Entity()
export class Borrower extends CustomBaseEntity {
    @Column()
    name: string;

    @OneToMany(() => Loan, (loan) => loan.borrower)
    loans?: Loan[];
}

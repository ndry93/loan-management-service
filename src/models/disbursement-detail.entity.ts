/* eslint-disable import/no-cycle */
import { Entity, OneToOne, Relation } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { Loan } from './loan.entity';

@Entity()
export class DisbursementDetail extends CustomBaseEntity {
    @OneToOne(() => Loan, (loan) => loan.disbursementDetail)
    loan: Relation<Loan>;
}

/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';
import { CustomBaseEntity } from './base/auditable';
import { DisbursementDetail } from './disbursement-detail.entity';
import { ApprovalDetail } from './approval-detail.entity';

@Entity()
export class Employee extends CustomBaseEntity {
    @Column()
    name: string;

    @OneToMany(() => DisbursementDetail, (disbursementDetail) => disbursementDetail.employee)
    disbursementDetails?: DisbursementDetail[];

    @OneToMany(() => ApprovalDetail, (approvalDetail) => approvalDetail.employee)
    approvalDetails?: ApprovalDetail[];
}

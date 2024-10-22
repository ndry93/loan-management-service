import { AuditableInterface } from './auditable.interface';

export type CreateBorrowerRequest = {
    name: string;
};

export interface BorrowerData extends AuditableInterface {
    id: string;
    name: string;
}

export type CreateBorrowerResponse = BorrowerData;

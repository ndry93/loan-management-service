import {
    BeforeSoftRemove,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Index(['deleted_at'])
export abstract class CustomBaseEntity {
    // added this so that on soft delete, the updated_at column is refreshed
    @BeforeSoftRemove()
    updateUpdatedAtColumn?() {
        this.updated_at = new Date();
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at?: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at?: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deleted_at?: Date;

    @Column({ nullable: true })
    created_by?: string;

    @Column({ nullable: true })
    updated_by?: string;
}

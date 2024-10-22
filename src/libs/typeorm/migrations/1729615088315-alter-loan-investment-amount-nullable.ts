import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterLoanInvestmentAmountNullable1729615088315 implements MigrationInterface {
    name = 'AlterLoanInvestmentAmountNullable1729615088315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "total_investment_amount" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "total_investment_amount" SET NOT NULL`);
    }

}

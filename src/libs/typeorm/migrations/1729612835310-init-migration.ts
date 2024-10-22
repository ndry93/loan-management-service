import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1729612835310 implements MigrationInterface {
    name = 'InitMigration1729612835310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "borrower" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying, "updated_by" character varying, "name" character varying NOT NULL, CONSTRAINT "PK_c9737036f657d00897e09029378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c5995713f5a27eef0bde951695" ON "borrower" ("deleted_at") `);
        await queryRunner.query(`CREATE TABLE "loan_investment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying, "updated_by" character varying, "loan_id" uuid, "investment_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "investor_name" character varying NOT NULL, "invested_amount" numeric(15,2) NOT NULL, CONSTRAINT "PK_984e6cbc7e283087e4b35d1d810" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eeb4474ccc204b75b4985e56b8" ON "loan_investment" ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_abf06bca4cadb9df949125593e" ON "loan_investment" ("loan_id") `);
        await queryRunner.query(`CREATE TABLE "approval_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying, "updated_by" character varying, "loan_id" uuid NOT NULL, "approval_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "validator_picture_url" character varying NOT NULL, "employee_id" uuid NOT NULL, CONSTRAINT "PK_454f23aafbef93a6f3ed4323bb0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_420d96dab7c564ae2319150052" ON "approval_detail" ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_096fd6910b1943f560cc095cdf" ON "approval_detail" ("loan_id") `);
        await queryRunner.query(`CREATE TABLE "employee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying, "updated_by" character varying, "name" character varying NOT NULL, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_05381ac4a848d1dcb4e49ee6fa" ON "employee" ("deleted_at") `);
        await queryRunner.query(`CREATE TABLE "disbursement_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying, "updated_by" character varying, "disbursement_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "agreement_letter_signed_url" character varying NOT NULL, "employee_id" uuid NOT NULL, CONSTRAINT "PK_3b2eda22e3eb1ca324226b8945e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1eea66b6fe9076961d9e3df396" ON "disbursement_detail" ("deleted_at") `);
        await queryRunner.query(`CREATE TYPE "public"."loan_status_enum" AS ENUM('Proposed', 'Disbursed', 'Invested', 'Approved')`);
        await queryRunner.query(`CREATE TABLE "loan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying, "updated_by" character varying, "borrower_id" uuid NOT NULL, "interest_rate" numeric(5,2) NOT NULL, "principal_amount" numeric(15,2) NOT NULL, "roi" numeric(5,2) NOT NULL, "agreement_letter_link" character varying NOT NULL, "status" "public"."loan_status_enum" NOT NULL DEFAULT 'Proposed', "interest_amount" numeric(15,2) NOT NULL, "total_investment_amount" numeric(15,2) NOT NULL, "disbursement_detail_id" uuid, CONSTRAINT "REL_8f1adb06f0906c8f44e01d6894" UNIQUE ("disbursement_detail_id"), CONSTRAINT "PK_4ceda725a323d254a5fd48bf95f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6bb36fee76aba665c92c56a7dd" ON "loan" ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f1adb06f0906c8f44e01d6894" ON "loan" ("disbursement_detail_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c96fb603d6c2ef272f16c98369" ON "loan" ("borrower_id") `);
        await queryRunner.query(`ALTER TABLE "loan_investment" ADD CONSTRAINT "FK_abf06bca4cadb9df949125593ee" FOREIGN KEY ("loan_id") REFERENCES "loan"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "approval_detail" ADD CONSTRAINT "FK_096fd6910b1943f560cc095cdfe" FOREIGN KEY ("loan_id") REFERENCES "loan"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "approval_detail" ADD CONSTRAINT "FK_c9ef31848597fba03b38cfcc793" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "disbursement_detail" ADD CONSTRAINT "FK_6ac37b1f8f97750a70bdf7c81df" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "loan" ADD CONSTRAINT "FK_c96fb603d6c2ef272f16c98369d" FOREIGN KEY ("borrower_id") REFERENCES "borrower"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "loan" ADD CONSTRAINT "FK_8f1adb06f0906c8f44e01d68946" FOREIGN KEY ("disbursement_detail_id") REFERENCES "disbursement_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "loan" DROP CONSTRAINT "FK_8f1adb06f0906c8f44e01d68946"`);
        await queryRunner.query(`ALTER TABLE "loan" DROP CONSTRAINT "FK_c96fb603d6c2ef272f16c98369d"`);
        await queryRunner.query(`ALTER TABLE "disbursement_detail" DROP CONSTRAINT "FK_6ac37b1f8f97750a70bdf7c81df"`);
        await queryRunner.query(`ALTER TABLE "approval_detail" DROP CONSTRAINT "FK_c9ef31848597fba03b38cfcc793"`);
        await queryRunner.query(`ALTER TABLE "approval_detail" DROP CONSTRAINT "FK_096fd6910b1943f560cc095cdfe"`);
        await queryRunner.query(`ALTER TABLE "loan_investment" DROP CONSTRAINT "FK_abf06bca4cadb9df949125593ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c96fb603d6c2ef272f16c98369"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f1adb06f0906c8f44e01d6894"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bb36fee76aba665c92c56a7dd"`);
        await queryRunner.query(`DROP TABLE "loan"`);
        await queryRunner.query(`DROP TYPE "public"."loan_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1eea66b6fe9076961d9e3df396"`);
        await queryRunner.query(`DROP TABLE "disbursement_detail"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05381ac4a848d1dcb4e49ee6fa"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_096fd6910b1943f560cc095cdf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_420d96dab7c564ae2319150052"`);
        await queryRunner.query(`DROP TABLE "approval_detail"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abf06bca4cadb9df949125593e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eeb4474ccc204b75b4985e56b8"`);
        await queryRunner.query(`DROP TABLE "loan_investment"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5995713f5a27eef0bde951695"`);
        await queryRunner.query(`DROP TABLE "borrower"`);
    }

}

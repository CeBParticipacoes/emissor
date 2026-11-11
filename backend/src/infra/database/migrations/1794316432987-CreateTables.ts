import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1794316432987 implements MigrationInterface {
    name = 'CreateTables1794316432987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" character varying NOT NULL, "name" character varying(150) NOT NULL, "document_value" character varying(14) NOT NULL, "document_type" character varying(10) NOT NULL, "email" character varying(320) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_customers_document_value" ON "customers"  ("document_value") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "name" character varying(150) NOT NULL, "email" character varying(320) NOT NULL, "password_hash" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_email" ON "users"  ("email") `);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" character varying NOT NULL, "customer_id" character varying NOT NULL, "description" character varying(500) NOT NULL, "total_amount_cents" integer NOT NULL, "installments_count" integer NOT NULL, "due_day" smallint NOT NULL, "first_due_date" date NOT NULL, "fine_percent" numeric(7,4) NOT NULL, "interest_monthly_percent" numeric(7,4) NOT NULL, "status" character varying(20) NOT NULL, "created_by" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_contracts_created_by" ON "contracts"  ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_contracts_customer_id" ON "contracts"  ("customer_id") `);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" character varying NOT NULL, "installment_id" character varying NOT NULL, "type" character varying(30) NOT NULL, "sent_at" TIMESTAMP WITH TIME ZONE NOT NULL, "message_id" character varying(255), "error" text, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_notifications_installment_type" ON "notifications"  ("installment_id", "type") `);
        await queryRunner.query(`CREATE TABLE "installments" ("id" character varying NOT NULL, "contract_id" character varying NOT NULL, "number" integer NOT NULL, "amount_cents" integer NOT NULL, "due_date" date NOT NULL, "status" character varying(20) NOT NULL, "idempotency_key" character varying NOT NULL, "cora_invoice_id" character varying, "bank_slip_url" text, "digitable_line" character varying(100), "pix_emv" text, "issue_attempts" integer NOT NULL DEFAULT '0', "last_issue_error" text, "issued_at" TIMESTAMP WITH TIME ZONE, "paid_at" TIMESTAMP WITH TIME ZONE, "cancelled_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c74e44aa06bdebef2af0a93da1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_installments_status_due_date" ON "installments"  ("status", "due_date") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_installments_cora_invoice_id" ON "installments"  ("cora_invoice_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_installments_idempotency_key" ON "installments"  ("idempotency_key") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_installments_contract_number" ON "installments"  ("contract_id", "number") `);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_2e66f7950711366031e3200413d" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_c0a3fac2a4731eabc427a4ad1b5" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_c8fb300968dff6fbffc34963a35" FOREIGN KEY ("installment_id") REFERENCES "installments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "installments" ADD CONSTRAINT "FK_78aae10b7c56a62a1d3523e3507" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "installments" DROP CONSTRAINT "FK_78aae10b7c56a62a1d3523e3507"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_c8fb300968dff6fbffc34963a35"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_c0a3fac2a4731eabc427a4ad1b5"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_2e66f7950711366031e3200413d"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_installments_contract_number"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_installments_idempotency_key"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_installments_cora_invoice_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_installments_status_due_date"`);
        await queryRunner.query(`DROP TABLE "installments"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_notifications_installment_type"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_contracts_customer_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_contracts_created_by"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_customers_document_value"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}

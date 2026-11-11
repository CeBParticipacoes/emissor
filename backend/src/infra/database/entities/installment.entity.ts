import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';

import type { InstallmentStatus } from '../../../domain/entities/installment.js';
import { ContractOrmEntity } from './contract.entity.js';
import { NotificationOrmEntity } from './notification.entity.js';

@Entity('installments')
@Index('UQ_installments_contract_number', ['contractId', 'number'], {
  unique: true,
})
@Index('UQ_installments_idempotency_key', ['idempotencyKey'], {
  unique: true,
})
@Index('UQ_installments_cora_invoice_id', ['coraInvoiceId'], {
  unique: true,
})
@Index('IDX_installments_status_due_date', ['status', 'dueDate'])
export class InstallmentOrmEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ name: 'contract_id', type: 'varchar' })
  contractId!: string;

  @ManyToOne(() => ContractOrmEntity, (contract) => contract.installments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'contract_id' })
  contract!: Relation<ContractOrmEntity>;

  @Column({ type: 'integer' })
  number!: number;

  @Column({ name: 'amount_cents', type: 'integer' })
  amountCents!: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: InstallmentStatus;

  @Column({ name: 'idempotency_key', type: 'varchar' })
  idempotencyKey!: string;

  @Column({
    name: 'cora_invoice_id',
    type: 'varchar',
    nullable: true,
  })
  coraInvoiceId!: string | null;

  @Column({ name: 'bank_slip_url', type: 'text', nullable: true })
  bankSlipUrl!: string | null;

  @Column({
    name: 'digitable_line',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  digitableLine!: string | null;

  @Column({ name: 'pix_emv', type: 'text', nullable: true })
  pixEmv!: string | null;

  @Column({ name: 'issue_attempts', type: 'integer', default: 0 })
  issueAttempts!: number;

  @Column({ name: 'last_issue_error', type: 'text', nullable: true })
  lastIssueError!: string | null;

  @Column({ name: 'issued_at', type: 'timestamptz', nullable: true })
  issuedAt!: Date | null;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt!: Date | null;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt!: Date | null;

  @OneToMany(
    () => NotificationOrmEntity,
    (notification) => notification.installment,
  )
  notifications!: Relation<NotificationOrmEntity[]>;
}
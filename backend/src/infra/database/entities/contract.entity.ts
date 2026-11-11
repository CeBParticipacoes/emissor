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

import type { ContractStatus } from '../../../domain/entities/contract.js';
import { CustomerOrmEntity } from './customer.entity.js';
import { InstallmentOrmEntity } from './installment.entity.js';
import { UserOrmEntity } from './user.entity.js';

const numericTransformer = {
  to: (value: number): number => value,
  from: (value: string | number): number => Number(value),
};

@Entity('contracts')
@Index('IDX_contracts_customer_id', ['customerId'])
@Index('IDX_contracts_created_by', ['createdBy'])
export class ContractOrmEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ name: 'customer_id', type: 'varchar' })
  customerId!: string;

  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.contracts, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Relation<CustomerOrmEntity>;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ name: 'total_amount_cents', type: 'integer' })
  totalAmountCents!: number;

  @Column({ name: 'installments_count', type: 'integer' })
  installmentsCount!: number;

  @Column({ name: 'due_day', type: 'smallint' })
  dueDay!: number;

  @Column({ name: 'first_due_date', type: 'date' })
  firstDueDate!: string;

  @Column({
    name: 'fine_percent',
    type: 'numeric',
    precision: 7,
    scale: 4,
    transformer: numericTransformer,
  })
  finePercent!: number;

  @Column({
    name: 'interest_monthly_percent',
    type: 'numeric',
    precision: 7,
    scale: 4,
    transformer: numericTransformer,
  })
  interestMonthlyPercent!: number;

  @Column({ type: 'varchar', length: 20 })
  status!: ContractStatus;

  @Column({ name: 'created_by', type: 'varchar' })
  createdBy!: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.createdContracts, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by' })
  creator!: Relation<UserOrmEntity>;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(
    () => InstallmentOrmEntity,
    (installment) => installment.contract,
  )
  installments!: Relation<InstallmentOrmEntity[]>;
}
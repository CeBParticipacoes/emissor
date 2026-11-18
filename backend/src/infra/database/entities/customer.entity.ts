import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import type { DocumentType } from '../../../domain/value-objects/document.js';
import { ContractOrmEntity } from './contract.entity.js';

@Entity('customers')
@Index('UQ_customers_document_value', ['documentValue'], {
  unique: true,
})
export class CustomerOrmEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({
    name: 'document_value',
    type: 'varchar',
    length: 14,
  })
  documentValue!: string;

  @Column({
    name: 'document_type',
    type: 'varchar',
    length: 10,
  })
  documentType!: DocumentType;

  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => ContractOrmEntity, (contract) => contract.customer)
  contracts!: ContractOrmEntity[];
}
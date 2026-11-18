import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ContractOrmEntity } from './contract.entity.js';

@Entity('users')
@Index('UQ_users_email', ['email'], { unique: true })
export class UserOrmEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => ContractOrmEntity, (contract) => contract.creator)
  createdContracts!: ContractOrmEntity[];
}
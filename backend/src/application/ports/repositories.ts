import type { Contract } from '../../domain/entities/contract.js';
import type { Customer } from '../../domain/entities/customer.js';
import type { Installment } from '../../domain/entities/installment.js';
import type { Notification, NotificationType } from '../../domain/entities/notification.js';
import type { User } from '../../domain/entities/user.js';

export const USER_REPOSITORY = Symbol('UserRepository');
export const CUSTOMER_REPOSITORY = Symbol('CustomerRepository');
export const CONTRACT_REPOSITORY = Symbol('ContractRepository');
export const INSTALLMENT_REPOSITORY = Symbol('InstallmentRepository');
export const NOTIFICATION_REPOSITORY = Symbol('NotificationRepository');

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface CustomerRepository {
  findByDocument(documentValue: string): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
}

export interface ContractRepository {
  findById(id: string): Promise<Contract | null>;
  list(): Promise<Contract[]>;

  saveWithInstallments(
    contract: Contract,
    installments: Installment[],
  ): Promise<void>;
  save(contract: Contract): Promise<void>;
}

export interface InstallmentRepository {
  findByContract(contractId: string): Promise<Installment[]>;
  findByCoraInvoiceId(coraInvoiceId: string): Promise<Installment | null>;

  findPendingDueUntil(limit: Date): Promise<Installment[]>;
  save(installment: Installment): Promise<void>;
}

export interface NotificationRepository {
  wasSent(
    installmentId: string,
    type: NotificationType,
  ): Promise<boolean>;
  record(notification: Notification): Promise<void>;
}
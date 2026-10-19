import { Inject, Injectable } from '@nestjs/common';
import { CONTRACT_REPOSITORY, CUSTOMER_REPOSITORY, type ContractRepository, type CustomerRepository } from '../ports/repositories.js';
import { CLOCK, type Clock } from '../ports/clock.js';

export interface CreateContractInput {
  customer: { name: string; document: string; email: string };
  description: string;
  totalAmountCents: number;
  installmentsCount: 12 | 24 | 36;
  dueDay: number;
  firstDueDate: Date;
  finePercent: number;
  interestMonthlyPercent: number;
  createdByUserId: string;
}

@Injectable()
export class CreateContractUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY) private readonly customers: CustomerRepository,
    @Inject(CONTRACT_REPOSITORY) private readonly contracts: ContractRepository,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async execute(_input: CreateContractInput): Promise<{ contractId: string }> {
    // TODO:
    // 1. Document.parse(input.customer.document) → valida CPF/CNPJ.
    // 2. customers.findByDocument(); se não existir, cria e salva.
    // 3. calculateInstallmentSchedule(...) → lista de parcelas.
    // 4. Para cada parcela: new Installment(randomUUID(), ..., status 'PENDING', idempotencyKey: randomUUID()).
    // 5. contracts.saveWithInstallments(contract, installments).
    // Escreva primeiro o teste com repositórios fake em memória.
    throw new Error('TODO: CreateContractUseCase');
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { BANK_GATEWAY, type BankGateway } from '../ports/bank-gateway.js';
import { CLOCK, type Clock } from '../ports/clock.js';
import { CONTRACT_REPOSITORY, INSTALLMENT_REPOSITORY, type ContractRepository, type InstallmentRepository } from '../ports/repositories.js';

@Injectable()
export class CancelContractUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY) private readonly contracts: ContractRepository,
    @Inject(INSTALLMENT_REPOSITORY) private readonly installments: InstallmentRepository,
    @Inject(BANK_GATEWAY) private readonly bank: BankGateway,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async execute(_input: { contractId: string }): Promise<void> {
    // TODO:
    // 1. contract.cancel(now).
    // 2. Para cada parcela não PAID: se tem coraInvoiceId, bank.cancelInvoice(); parcela.cancel(now); save.
    // 3. contracts.save(contract).
    throw new Error('TODO: CancelContractUseCase');
  }
}

import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (acc, curr) => {
        let accumulated;
        if (curr.type === 'income') {
          accumulated = {
            income: acc.income + Number(curr.value),
            outcome: acc.outcome,
            total: acc.total + Number(curr.value),
          };
        } else {
          accumulated = {
            income: acc.income,
            outcome: acc.outcome + Number(curr.value),
            total: acc.total - Number(curr.value),
          };
        }

        return accumulated;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;

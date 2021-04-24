export type ICreateTransactionDTO = {
  description: string;
  type: 'income' | 'outcome';
  category: string;
  amount: number;
  date: Date;
};

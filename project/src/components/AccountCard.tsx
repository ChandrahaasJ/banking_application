import React from 'react';
import { CreditCard, Eye } from 'lucide-react';
import LoadingButton from './LoadingButton';

interface Account {
  accountNumber: string;
  balance?: number;
  isBalanceLoading?: boolean;
}

interface AccountCardProps {
  account: Account;
  onCheckBalance: (accountNumber: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onCheckBalance }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <CreditCard className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Account</h3>
          <p className="text-sm text-slate-600">{account.accountNumber}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {account.balance !== undefined ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">Current Balance</p>
            <p className="text-2xl font-bold text-green-800">
              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-600">Balance not loaded</p>
          </div>
        )}
        
        <LoadingButton
          isLoading={account.isBalanceLoading || false}
          onClick={() => onCheckBalance(account.accountNumber)}
        >
          <Eye className="h-4 w-4 mr-2" />
          {account.balance !== undefined ? 'Refresh Balance' : 'Check Balance'}
        </LoadingButton>
      </div>
    </div>
  );
};

export default AccountCard;
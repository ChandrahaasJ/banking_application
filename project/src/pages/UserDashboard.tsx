import React, { useState } from 'react';
import { MapPin, Send, Eye, CreditCard } from 'lucide-react';
import LoadingButton from '../components/LoadingButton';
import FormCard from '../components/FormCard';
import AccountCard from '../components/AccountCard';
import { apiService } from '../services/apiService';

interface Account {
  accountNumber: string;
  balance?: number;
  isBalanceLoading?: boolean;
}

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('make-transaction');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [addressForm, setAddressForm] = useState({ 
    crn: '', 
    city: '', 
    state: '', 
    zip_code: '' 
  });
  const [transactionForm, setTransactionForm] = useState({
    senderAccountId: '',
    recipientAccountId: '',
    amount: '',
  });
  const [accountsForm, setAccountsForm] = useState({ crn: '' });
  const [accounts, setAccounts] = useState<Account[]>([]);

  const resetMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      await apiService.addAddress({
        crn: parseInt(addressForm.crn),
        city: addressForm.city,
        state: addressForm.state,
        zip_code: addressForm.zip_code
      });
      setSuccessMessage('Address added successfully!');
      setAddressForm({ crn: '', city: '', state: '', zip_code: '' });
    } catch (error) {
      setErrorMessage('Failed to add address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      await apiService.updateBalance({
        account_number: parseInt(transactionForm.senderAccountId),
        new_balance: parseFloat(transactionForm.amount)
      });
      setSuccessMessage('Transaction completed successfully!');
      setTransactionForm({
        senderAccountId: '',
        recipientAccountId: '',
        amount: '',
      });
    } catch (error) {
      setErrorMessage('Transaction failed. Please check the details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAccounts = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      const accountsData = await apiService.getCustomerAccounts(parseInt(accountsForm.crn));
      setAccounts(accountsData.map((acc: any) => ({ ...acc, isBalanceLoading: false })));
      setSuccessMessage('Accounts loaded successfully!');
    } catch (error) {
      setErrorMessage('Failed to load accounts. Please check the CRN and try again.');
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckBalance = async (accountNumber: string) => {
    setAccounts(prev =>
      prev.map(acc =>
        acc.accountNumber === accountNumber
          ? { ...acc, isBalanceLoading: true }
          : acc
      )
    );

    try {
      const balanceData = await apiService.getAccountBalance(parseInt(accountNumber));
      setAccounts(prev =>
        prev.map(acc =>
          acc.accountNumber === accountNumber
            ? { ...acc, balance: balanceData.balance, isBalanceLoading: false }
            : acc
        )
      );
    } catch (error) {
      setAccounts(prev =>
        prev.map(acc =>
          acc.accountNumber === accountNumber
            ? { ...acc, isBalanceLoading: false }
            : acc
        )
      );
      setErrorMessage(`Failed to load balance for account ${accountNumber}`);
    }
  };

  const tabs = [
    { id: 'make-transaction', label: 'Transfer Funds', icon: Send },
    { id: 'view-accounts', label: 'My Accounts', icon: Eye },
    { id: 'add-address', label: 'Add Address', icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Portal</h1>
        <p className="text-slate-600">Manage your banking needs</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-1 bg-slate-100 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                resetMessages();
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'make-transaction' && (
        <FormCard title="Transfer Funds" icon={Send}>
          <form onSubmit={handleMakeTransaction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                From Account ID
              </label>
              <input
                type="number"
                value={transactionForm.senderAccountId}
                onChange={(e) => setTransactionForm({ ...transactionForm, senderAccountId: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter sender account ID"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                To Account ID
              </label>
              <input
                type="number"
                value={transactionForm.recipientAccountId}
                onChange={(e) => setTransactionForm({ ...transactionForm, recipientAccountId: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter recipient account ID"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter transfer amount"
                required
              />
            </div>
            
            <LoadingButton type="submit" isLoading={isLoading}>
              Transfer Funds
            </LoadingButton>
          </form>
        </FormCard>
      )}

      {activeTab === 'view-accounts' && (
        <div className="space-y-6">
          <FormCard title="View Your Accounts" icon={CreditCard}>
            <form onSubmit={handleViewAccounts} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Reference Number (CRN)
                </label>
                <input
                  type="number"
                  value={accountsForm.crn}
                  onChange={(e) => setAccountsForm({ ...accountsForm, crn: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your CRN"
                  required
                />
              </div>
              
              <LoadingButton type="submit" isLoading={isLoading}>
                Load Accounts
              </LoadingButton>
            </form>
          </FormCard>

          {accounts.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <AccountCard
                  key={account.accountNumber}
                  account={account}
                  onCheckBalance={handleCheckBalance}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add-address' && (
        <FormCard title="Add Secondary Address" icon={MapPin}>
          <form onSubmit={handleAddAddress} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Reference Number (CRN)
              </label>
              <input
                type="number"
                value={addressForm.crn}
                onChange={(e) => setAddressForm({ ...addressForm, crn: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your CRN"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter city"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={addressForm.zip_code}
                onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ZIP code"
                required
              />
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                This will be added as a secondary address to your profile. Your primary address remains unchanged.
              </p>
            </div>
            
            <LoadingButton type="submit" isLoading={isLoading}>
              Add Address
            </LoadingButton>
          </form>
        </FormCard>
      )}
    </div>
  );
};

export default UserDashboard;
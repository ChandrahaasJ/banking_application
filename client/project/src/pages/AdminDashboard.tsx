import React, { useState } from 'react';
import { UserPlus, Trash2, PlusCircle, Users, CreditCard } from 'lucide-react';
import LoadingButton from '../components/LoadingButton';
import FormCard from '../components/FormCard';
import { apiService } from '../services/apiService';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('add-customer');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [customerForm, setCustomerForm] = useState({ 
    name: '', 
    city: '', 
    state: '', 
    zip_code: '' 
  });
  const [deleteForm, setDeleteForm] = useState({ crn: '' });
  const [accountForm, setAccountForm] = useState({ crn: '', initial_balance: '' });

  const resetMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      await apiService.createUser({
        name: customerForm.name,
        city: customerForm.city,
        state: customerForm.state,
        zip_code: customerForm.zip_code
      });
      setSuccessMessage('Customer added successfully!');
      setCustomerForm({ name: '', city: '', state: '', zip_code: '' });
    } catch (error) {
      setErrorMessage('Failed to add customer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      // Note: Delete customer endpoint not available in new API service
      // This would need to be implemented in the backend
      setErrorMessage('Delete customer functionality not yet implemented in the API.');
    } catch (error) {
      setErrorMessage('Failed to delete customer. Please check the CRN and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      await apiService.addAccount({
        crn: parseInt(accountForm.crn),
        initial_balance: parseFloat(accountForm.initial_balance)
      });
      setSuccessMessage('Account created successfully!');
      setAccountForm({ crn: '', initial_balance: '' });
    } catch (error) {
      setErrorMessage('Failed to create account. Please check the details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'add-customer', label: 'Add Customer', icon: UserPlus },
    { id: 'delete-customer', label: 'Delete Customer', icon: Trash2 },
    { id: 'add-account', label: 'Open Account', icon: PlusCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Manage customers and accounts</p>
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
      {activeTab === 'add-customer' && (
        <FormCard title="Add New Customer" icon={Users}>
          <form onSubmit={handleAddCustomer} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer's full name"
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
                  value={customerForm.city}
                  onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
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
                  value={customerForm.state}
                  onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })}
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
                value={customerForm.zip_code}
                onChange={(e) => setCustomerForm({ ...customerForm, zip_code: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ZIP code"
                required
              />
            </div>
            
            <LoadingButton type="submit" isLoading={isLoading}>
              Add Customer
            </LoadingButton>
          </form>
        </FormCard>
      )}

      {activeTab === 'delete-customer' && (
        <FormCard title="Delete Customer" icon={Trash2}>
          <form onSubmit={handleDeleteCustomer} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Reference Number (CRN)
              </label>
              <input
                type="text"
                value={deleteForm.crn}
                onChange={(e) => setDeleteForm({ ...deleteForm, crn: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter CRN to delete customer"
                required
              />
            </div>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All customer data and associated accounts will be permanently deleted.
              </p>
            </div>
            
            <LoadingButton type="submit" isLoading={isLoading} variant="danger">
              Delete Customer
            </LoadingButton>
          </form>
        </FormCard>
      )}

      {activeTab === 'add-account' && (
        <FormCard title="Open New Account" icon={CreditCard}>
          <form onSubmit={handleAddAccount} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Reference Number (CRN)
              </label>
              <input
                type="number"
                value={accountForm.crn}
                onChange={(e) => setAccountForm({ ...accountForm, crn: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer's CRN"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Initial Balance ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={accountForm.initial_balance}
                onChange={(e) => setAccountForm({ ...accountForm, initial_balance: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter initial deposit amount"
                required
              />
            </div>
            
            <LoadingButton type="submit" isLoading={isLoading}>
              Open Account
            </LoadingButton>
          </form>
        </FormCard>
      )}
    </div>
  );
};

export default AdminDashboard;
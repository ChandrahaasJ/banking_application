// Mock API service for demonstration
// In production, replace these with actual API calls

const API_BASE_URL = 'http://localhost:8000';

interface CustomerData {
  name: string;
  city: string;
  state: string;
  zip_code: string;
}

interface AddressData {
  crn: number;
  city: string;
  state: string;
  zip_code: string;
}

interface AccountData {
  crn: number;
  initial_balance: number;
}

interface BalanceUpdateData {
  account_number: number;
  new_balance: number;
}

export const apiService = {
  async createUser(data: CustomerData) {
    const response = await fetch(`${API_BASE_URL}/create_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Create User Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData?.detail || 'Unknown error'
      });
      throw new Error(errorData?.detail || 'Failed to create user');
    }
    return response.json();
  },

  async addAddress(data: AddressData) {
    const response = await fetch(`${API_BASE_URL}/add_address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Add Address Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData?.detail || 'Unknown error'
      });
      throw new Error(errorData?.detail || 'Failed to add address');
    }
    return response.json();
  },

  async addAccount(data: AccountData) {
    const response = await fetch(`${API_BASE_URL}/add_account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Add Account Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData?.detail || 'Unknown error'
      });
      throw new Error(errorData?.detail || 'Failed to create account');
    }
    return response.json();
  },

  async updateBalance(data: BalanceUpdateData) {
    const response = await fetch(`${API_BASE_URL}/update_balance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Update Balance Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData?.detail || 'Unknown error'
      });
      throw new Error(errorData?.detail || 'Failed to update balance');
    }
    return response.json();
  },

  async getCustomerAccounts(crn: number) {
    const response = await fetch(`${API_BASE_URL}/customer/${crn}/accounts`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Get Customer Accounts Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData?.detail || 'Unknown error'
      });
      throw new Error(errorData?.detail || 'Failed to fetch customer accounts');
    }
    return response.json();
  },

  async getAccountBalance(accountNumber: number) {
    const response = await fetch(`${API_BASE_URL}/account/${accountNumber}/balance`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Get Account Balance Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData?.detail || 'Unknown error'
      });
      throw new Error(errorData?.detail || 'Failed to fetch account balance');
    }
    return response.json();
  },
};
# SecureBank - Banking Application

A comprehensive banking application built with React and TypeScript, featuring separate admin and user portals for complete banking operations management.

## Features

### Admin Portal
- **Customer Management**: Add new customers with name and address
- **Account Operations**: Open new accounts for existing customers
- **Customer Deletion**: Remove customers and associated accounts
- **Secure Authentication**: Admin-only access with role-based permissions

### User Portal
- **Address Management**: Add secondary addresses to customer profiles
- **Fund Transfers**: Transfer money between accounts with validation
- **Account Overview**: View all accounts associated with a customer
- **Balance Checking**: Real-time balance inquiries for individual accounts

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with responsive design
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Authentication**: Context-based authentication system

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the displayed local URL

## Demo Credentials

### Admin Access
- **Username**: admin
- **Password**: admin123

### User Access
- **Username**: user
- **Password**: user123

## API Endpoints

The application is designed to work with the following backend endpoints:

### Admin Endpoints
- `POST /add_customer` - Add new customer
- `POST /delete_customer` - Delete existing customer
- `POST /add_account` - Create new account

### User Endpoints
- `POST /add_address` - Add secondary address
- `POST /make_transaction` - Process fund transfer
- `GET /customer/{crn}/accounts` - Retrieve customer accounts
- `GET /account/{account_number}/balance` - Get account balance

## Mock Backend

Currently, the application uses a mock API service for demonstration purposes. All API calls are simulated with realistic delays and occasional failures to demonstrate error handling.

### Setting up a Real Backend

To connect to a real backend:

1. Update `src/services/apiService.ts`
2. Replace the mock functions with actual fetch calls
3. Configure CORS on your backend server
4. Update the `API_BASE_URL` constant

Example real API call:
```typescript
async addCustomer(data: { name: string; address: string }) {
  const response = await fetch(`${API_BASE_URL}/add_customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AccountCard.tsx
│   ├── FormCard.tsx
│   ├── Layout.tsx
│   ├── LoadingButton.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Main application pages
│   ├── AdminDashboard.tsx
│   ├── Login.tsx
│   └── UserDashboard.tsx
├── services/           # API service layer
│   └── apiService.ts
└── App.tsx            # Main application component
```

## Key Features

### Security
- Role-based authentication
- Protected routes
- Session management
- Input validation

### User Experience
- Responsive design for all devices
- Loading states and error handling
- Clear success/error messaging
- Intuitive navigation

### Performance
- Optimized component structure
- Efficient state management
- Minimal re-renders
- Fast development builds

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production
```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes. Please ensure you have proper licensing for any production use.
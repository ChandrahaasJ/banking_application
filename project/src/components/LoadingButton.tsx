import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  type?: 'button' | 'submit';
  isLoading: boolean;
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger';
  disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  type = 'button',
  isLoading,
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  const baseClasses = 'w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
  
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
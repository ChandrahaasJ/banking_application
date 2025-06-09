import React, { ReactNode } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FormCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default FormCard;
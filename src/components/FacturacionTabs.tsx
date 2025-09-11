import React from 'react';
import { CreditCard, Euro, FileText } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count?: number;
}

interface FacturacionTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const FacturacionTabs: React.FC<FacturacionTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'facturas', name: 'Facturas', icon: CreditCard, count: 20 },
    { id: 'recibos', name: 'Recibos', icon: Euro, count: 45 },
    { id: 'arqueos', name: 'Arqueos', icon: FileText, count: 12 },
  ];

  return (
    <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center py-6 px-2 border-b-3 font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className={`h-5 w-5 mr-3 ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span>{tab.name}</span>
              {tab.count && (
                <span className={`ml-3 px-2 py-1 text-xs rounded-full font-medium ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FacturacionTabs;
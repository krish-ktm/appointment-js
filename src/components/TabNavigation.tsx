interface TabNavigationProps {
  activeTab: 'appointments' | 'users';
  onTabChange: (tab: 'appointments' | 'users') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange('appointments')}
          className={`
            py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'appointments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          Appointments
        </button>
        <button
          onClick={() => onTabChange('users')}
          className={`
            py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'users'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          Users
        </button>
      </nav>
    </div>
  );
}
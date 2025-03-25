import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface Rule {
  id: string;
  title: {
    en: string;
    gu: string;
  };
  content: {
    en: string;
    gu: string;
  };
  display_order: number;
  updated_at: string;
}

interface AppointmentRuleItemProps {
  rule: Rule;
  language: 'en' | 'gu';
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string, order: number) => void;
  onMoveDown: (id: string, order: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function AppointmentRuleItem({
  rule,
  language,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}: AppointmentRuleItemProps) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-medium text-gray-900">{rule.title[language]}</h4>
          </div>
          <p className="mt-2 text-gray-600">{rule.content[language]}</p>
          <p className="mt-2 text-xs text-gray-500">
            Last updated: {new Date(rule.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(rule)}
            className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-150"
            title="Edit Rule"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(rule.id)}
            className="p-2 text-red-400 hover:text-red-500 transition-colors duration-150"
            title="Delete Rule"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onMoveUp(rule.id, rule.display_order - 1)}
            className="p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50 transition-colors duration-150"
            disabled={isFirst}
            title="Move Up"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          <button
            onClick={() => onMoveDown(rule.id, rule.display_order + 1)}
            className="p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50 transition-colors duration-150"
            disabled={isLast}
            title="Move Down"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 
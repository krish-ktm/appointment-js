import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, Save, X, Plus } from 'lucide-react';

interface ImageDownloadRule {
  id: string;
  type: 'patient' | 'mr';
  title: Record<string, string>;
  content: Record<string, string>;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ImageDownloadRulesProps {
  type: 'patient' | 'mr';
}

export default function ImageDownloadRules({ type }: ImageDownloadRulesProps) {
  const [rules, setRules] = useState<ImageDownloadRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<ImageDownloadRule | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ImageDownloadRule>>({
    type,
    title: { en: 'Important Notes', gu: 'મહત્વપૂર્ણ નોંધ' },
    content: { en: '', gu: '' },
    order: 1,
    is_active: true
  });

  useEffect(() => {
    fetchRules();
  }, [type]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('image_download_rules')
        .select('*')
        .eq('type', type)
        .order('order', { ascending: true });

      if (error) throw error;
      
      setRules(data || []);
    } catch (error: unknown) {
      console.error('Error fetching rules:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: ImageDownloadRule) => {
    setEditingId(rule.id);
    setEditingRule({ ...rule });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRule(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRule) return;
    
    try {
      const { error } = await supabase
        .from('image_download_rules')
        .update({
          title: editingRule.title,
          content: editingRule.content,
          order: editingRule.order,
          is_active: editingRule.is_active
        })
        .eq('id', editingRule.id);

      if (error) throw error;
      
      toast.success('Rule updated successfully');
      setEditingId(null);
      setEditingRule(null);
      fetchRules();
    } catch (error: unknown) {
      console.error('Error updating rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to update rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    
    try {
      const { error } = await supabase
        .from('image_download_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Rule deleted successfully');
      fetchRules();
    } catch (error: unknown) {
      console.error('Error deleting rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to delete rule');
    }
  };

  const handleAddNew = async () => {
    try {
      const { error } = await supabase
        .from('image_download_rules')
        .insert({
          type,
          title: newRule.title,
          content: newRule.content,
          order: newRule.order,
          is_active: newRule.is_active
        });

      if (error) throw error;
      
      toast.success('Rule added successfully');
      setShowAddNew(false);
      setNewRule({
        type,
        title: { en: 'Important Notes', gu: 'મહત્વપૂર્ણ નોંધ' },
        content: { en: '', gu: '' },
        order: 1,
        is_active: true
      });
      fetchRules();
    } catch (error: unknown) {
      console.error('Error adding rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to add rule');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Image Download Rules for {type === 'patient' ? 'Regular Appointments' : 'MR Appointments'}
        </h3>
        <button
          onClick={() => setShowAddNew(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} /> Add New Rule
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {rules.length === 0 && !showAddNew && (
          <div className="px-6 py-8 text-center text-gray-500">
            No rules found. Click "Add New Rule" to create one.
          </div>
        )}

        {rules.map(rule => (
          <div key={rule.id} className="px-6 py-4">
            {editingId === rule.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={editingRule?.title?.en || ''}
                    onChange={(e) => setEditingRule(prev => prev ? {
                      ...prev,
                      title: { ...(prev.title || {}), en: e.target.value }
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Gujarati)
                  </label>
                  <input
                    type="text"
                    value={editingRule?.title?.gu || ''}
                    onChange={(e) => setEditingRule(prev => prev ? {
                      ...prev,
                      title: { ...(prev.title || {}), gu: e.target.value }
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (English) - Use markdown format with "-" for bullet points
                  </label>
                  <textarea
                    value={editingRule?.content?.en || ''}
                    onChange={(e) => setEditingRule(prev => prev ? {
                      ...prev,
                      content: { ...(prev.content || {}), en: e.target.value }
                    } : null)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (Gujarati) - Use markdown format with "-" for bullet points
                  </label>
                  <textarea
                    value={editingRule?.content?.gu || ''}
                    onChange={(e) => setEditingRule(prev => prev ? {
                      ...prev,
                      content: { ...(prev.content || {}), gu: e.target.value }
                    } : null)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingRule?.order || 0}
                    onChange={(e) => setEditingRule(prev => prev ? {
                      ...prev,
                      order: parseInt(e.target.value) || 0
                    } : null)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`active-${rule.id}`}
                    checked={editingRule?.is_active || false}
                    onChange={(e) => setEditingRule(prev => prev ? {
                      ...prev,
                      is_active: e.target.checked
                    } : null)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`active-${rule.id}`} className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {rule.title?.en || 'Important Notes'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {rule.title?.gu || 'મહત્વપૂર્ણ નોંધ'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      Order: {rule.order}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">English Content</h5>
                    <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-md">
                      {rule.content?.en || 'No content'}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">Gujarati Content</h5>
                    <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-md">
                      {rule.content?.gu || 'No content'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {showAddNew && (
          <div className="px-6 py-4 space-y-4 bg-blue-50">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Add New Rule</h3>
              <button
                onClick={() => setShowAddNew(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (English)
              </label>
              <input
                type="text"
                value={newRule.title?.en || ''}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  title: { ...(prev.title || {}), en: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (Gujarati)
              </label>
              <input
                type="text"
                value={newRule.title?.gu || ''}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  title: { ...(prev.title || {}), gu: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (English) - Use markdown format with "-" for bullet points
              </label>
              <textarea
                value={newRule.content?.en || ''}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  content: { ...(prev.content || {}), en: e.target.value }
                }))}
                rows={4}
                placeholder="- Please arrive 10 minutes before your appointment time
- Bring your previous medical records
- Wear a mask during your visit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (Gujarati) - Use markdown format with "-" for bullet points
              </label>
              <textarea
                value={newRule.content?.gu || ''}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  content: { ...(prev.content || {}), gu: e.target.value }
                }))}
                rows={4}
                placeholder="- કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો
- તમારા અગાઉના મેડિકલ રેકોર્ડ્સ લાવો
- તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={newRule.order || 1}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  order: parseInt(e.target.value) || 1
                }))}
                className="w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new-active"
                checked={newRule.is_active || false}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  is_active: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="new-active" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
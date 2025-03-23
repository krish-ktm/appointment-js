import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, X, Upload } from 'lucide-react';
import { Notice } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface NoticeFormProps {
  editingNotice: Notice | null;
  onSubmit: (formData: { title: string; content: string; image_url: string; images: string[]; active: boolean }) => Promise<void>;
  onClose: () => void;
}

export function NoticeForm({ editingNotice, onSubmit, onClose }: NoticeFormProps) {
  const [form, setForm] = useState({
    title: editingNotice?.title || '',
    content: editingNotice?.content || '',
    image_url: '',
    images: editingNotice?.images || [],
    active: editingNotice?.active ?? true
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setUploading(true);

      // First sign in with Supabase Auth
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'ktpatel100@gmail.com',
        password: 'Krish@12'
      });

      if (signInError) throw signInError;

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('notices')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notices')
        .getPublicUrl(fileName);

      // Add to images array
      setForm(prev => ({
        ...prev,
        images: [...prev.images, publicUrl]
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleAddImage = () => {
    if (form.image_url && !form.images.includes(form.image_url)) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, prev.image_url],
        image_url: ''
      }));
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const imageUrl = form.images[index];
      
      // If it's a Supabase storage URL, delete from storage
      if (imageUrl.includes(supabase.storageUrl)) {
        // Sign in first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'ktpatel100@gmail.com',
          password: 'Krish@12'
        });

        if (signInError) throw signInError;

        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage
            .from('notices')
            .remove([path]);
        }
      }

      setForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-[9999] overflow-y-auto"
      style={{ margin: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto my-auto relative"
        style={{ maxHeight: '96vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-[9999] bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(96vh - 83px)' }}>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Images
              </label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="relative px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </div>
                  </div>
                </label>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Or enter image URL"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {form.images.length > 0 && (
              <div className="col-span-2 grid grid-cols-4 gap-2">
                {form.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="col-span-2 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingNotice ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

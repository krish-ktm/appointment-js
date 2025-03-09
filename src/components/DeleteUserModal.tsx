import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { User } from '../types';

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteUserModal({ user, onClose, onConfirm, loading }: DeleteUserModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Delete User</h2>
          <button
            onClick={onClose}
            className="hover:bg-red-500 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the user <span className="font-semibold">{user.name}</span>?
            This action cannot be undone.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              User Details:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-yellow-700">
              <li>Email: {user.email}</li>
              <li>Role: {user.role}</li>
              <li>Status: {user.status}</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
import { useState } from 'react';
import { User } from '../types';
import { updateUser, deleteUser } from '../lib/auth';
import { toast } from 'react-hot-toast';
import { CreateUserModal } from './CreateUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { EditUserModal } from './EditUserModal';

interface UsersTableProps {
  users: User[];
  onUserUpdated: () => void;
}

export function UsersTable({ users, onUserUpdated }: UsersTableProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const { success, error } = await updateUser(user.id, { status: newStatus });
      
      if (error) throw new Error(error);
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      onUserUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      const { success, error } = await deleteUser(userToDelete.id);
      
      if (error) throw new Error(error);
      
      toast.success('User deleted successfully');
      setUserToDelete(null);
      onUserUpdated();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => setUserToEdit(user)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`text-sm font-medium ${
                          user.status === 'active'
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={onUserUpdated}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteUser}
          loading={loading}
        />
      )}

      {userToEdit && (
        <EditUserModal
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
}
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryTypeApi } from '@lib/api/deliveryTypes';
import type { DeliveryType } from '@lib/api/deliveryTypes';
import DeliveryTypeCreateModal from '@components/DeliveryTypeCreateModal';
import DeliveryTypeEditModal from '@components/DeliveryTypeEditModal';

export default function DeliveryTypesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDeliveryTypeId, setSelectedDeliveryTypeId] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['deliveryTypes', page],
    queryFn: () => deliveryTypeApi.getAll({ page, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deliveryTypeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryTypes'] });
      alert('Delivery type deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting delivery type:', error);
      alert(`Failed to delete delivery type: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    },
  });

  const handleEditDeliveryType = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDeliveryTypeId(id);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedDeliveryTypeId(null);
  };

  const handleDeleteDeliveryType = (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading delivery types...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="p-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="ml-3 text-red-700 font-medium">Error loading delivery types</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Types Management</h1>
            <p className="text-gray-600">Create and manage delivery options for orders</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Delivery Type
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estimated Days
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data?.items.map((deliveryType: DeliveryType) => (
              <tr key={deliveryType.id} className="hover:bg-indigo-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {deliveryType.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-md">
                    {deliveryType.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${deliveryType.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {deliveryType.estimatedDays ? `${deliveryType.estimatedDays} days` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    deliveryType.isActive
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                  }`}>
                    {deliveryType.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => handleEditDeliveryType(deliveryType.id, e)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteDeliveryType(deliveryType.id, deliveryType.name, e)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data && data.items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No delivery types found</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add New Delivery Type" to create one</p>
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700">
              Showing page {data.pagination.page} of {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <DeliveryTypeCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      {selectedDeliveryTypeId && (
        <DeliveryTypeEditModal
          deliveryTypeId={selectedDeliveryTypeId}
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}

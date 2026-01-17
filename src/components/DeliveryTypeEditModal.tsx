import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deliveryTypeApi } from '@lib/api/deliveryTypes';
import type { CreateDeliveryTypeRequest } from '@lib/api/deliveryTypes';

interface DeliveryTypeEditModalProps {
  deliveryTypeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeliveryTypeEditModal({ deliveryTypeId, isOpen, onClose }: DeliveryTypeEditModalProps) {
  const queryClient = useQueryClient();

  const { data: deliveryType, isLoading } = useQuery({
    queryKey: ['deliveryType', deliveryTypeId],
    queryFn: () => deliveryTypeApi.getById(deliveryTypeId),
    enabled: isOpen && !!deliveryTypeId,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateDeliveryTypeRequest>({
    defaultValues: {
      price: 0,
      estimatedDays: 7,
      isActive: true,
      displayOrder: 0,
    },
  });

  // Reset form when delivery type data loads
  useEffect(() => {
    if (deliveryType) {
      reset({
        name: deliveryType.name,
        description: deliveryType.description || '',
        price: deliveryType.price,
        estimatedDays: deliveryType.estimatedDays || undefined,
        isActive: deliveryType.isActive,
        displayOrder: deliveryType.displayOrder || 0,
      });
    }
  }, [deliveryType, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateDeliveryTypeRequest>) => deliveryTypeApi.update(deliveryTypeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryTypes'] });
      queryClient.invalidateQueries({ queryKey: ['deliveryType', deliveryTypeId] });
      onClose();
    },
  });

  const onSubmit = async (data: CreateDeliveryTypeRequest) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating delivery type:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading delivery type...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleClose}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        {/* Modal panel */}
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-900">Edit Delivery Type</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Standard Shipping, Express Delivery"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Describe the delivery type..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { required: true, valueAsNumber: true, min: 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">Price is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Days
                    </label>
                    <input
                      type="number"
                      {...register('estimatedDays', { valueAsNumber: true, min: 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="7"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      {...register('displayOrder', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center pt-8">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isActive')}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Delivery Type'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

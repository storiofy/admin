import type { UserDetailResponse } from '@lib/api/users';
import type { Personalization } from '@lib/api/users';

interface UserViewModalProps {
  user: UserDetailResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserViewModal({ user, isOpen, onClose }: UserViewModalProps) {
  if (!isOpen) return null;

  const orders = user.orders || [];
  const personalizations = user.personalizations || [];
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        {/* Modal panel */}
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                {user.isAdmin && (
                  <span className="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
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
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* User Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  {user.emailVerifiedAt && (
                    <span className="text-xs text-green-600">✓ Verified</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{user.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span
                    className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {user.lastLoginAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Login</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{personalizations.length}</p>
                  <p className="text-sm text-gray-500">Personalizations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
              </div>

              {/* Orders Section */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Orders ({orders.length})
                </h4>
                {orders.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">Order #{order.orderNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items?.length || 0} item(s)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">${order.total?.toFixed(2)}</p>
                            <span
                              className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        {order.trackingNumber && (
                          <p className="text-xs text-gray-500 mt-2">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No orders found</p>
                )}
              </div>

              {/* Personalizations Section */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Personalizations ({personalizations.length})
                </h4>
                {personalizations.length > 0 ? (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {personalizations.map((personalization: Personalization) => (
                      <div
                        key={personalization.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex gap-4">
                          {/* Child Photo */}
                          <div className="flex-shrink-0">
                            <img
                              src={personalization.childPhotoUrl}
                              alt={`${personalization.childFirstName}'s photo`}
                              className="h-20 w-20 object-cover rounded-lg border"
                            />
                          </div>

                          {/* Child Information */}
                          <div className="flex-1">
                            <h5 className="font-semibold text-sm mb-2">
                              {personalization.childFirstName}
                            </h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Age:</span>{' '}
                                <span className="font-medium">{personalization.childAge} years</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Language:</span>{' '}
                                <span className="font-medium">
                                  {personalization.languageCode.toUpperCase()}
                                </span>
                              </div>
                              {personalization.book && (
                                <div>
                                  <span className="text-gray-500">Book:</span>{' '}
                                  <span className="font-medium">{personalization.book.title}</span>
                                </div>
                              )}
                              {personalization.sticker && (
                                <div>
                                  <span className="text-gray-500">Sticker:</span>{' '}
                                  <span className="font-medium">{personalization.sticker.title}</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <span
                                className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                                  personalization.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : personalization.status === 'approved'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {personalization.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {new Date(personalization.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No personalizations found</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


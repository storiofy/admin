import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@lib/api/users';
import type { Personalization } from '@lib/api/users';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getById(id!),
    enabled: !!id,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['user-orders', id],
    queryFn: () => userApi.getUserOrders(id!),
    enabled: !!id,
  });

  const { data: personalizations, isLoading: personalizationsLoading } = useQuery({
    queryKey: ['user-personalizations', id],
    queryFn: () => userApi.getUserPersonalizations(id!),
    enabled: !!id,
  });

  if (userLoading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        User Details: {user.firstName} {user.lastName}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* User Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Name
                </label>
                <p className="text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user.email}</p>
                {user.emailVerifiedAt && (
                  <span className="text-xs text-green-600">✓ Verified</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{user.phone || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                <span
                  className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                {user.isAdmin && (
                  <span className="ml-2 px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Admin
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user.lastLoginAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Login
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.lastLoginAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Orders ({orders?.length || 0})
            </h2>
            {ordersLoading ? (
              <div>Loading orders...</div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items?.length || 0} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total?.toFixed(2)}</p>
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
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
                      <p className="text-sm text-gray-500 mt-2">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>

          {/* Personalizations with Child Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Personalizations ({personalizations?.length || 0})
            </h2>
            {personalizationsLoading ? (
              <div>Loading personalizations...</div>
            ) : personalizations && personalizations.length > 0 ? (
              <div className="space-y-6">
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
                          className="h-24 w-24 object-cover rounded-lg border"
                        />
                      </div>

                      {/* Child Information */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {personalization.childFirstName}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Age:</span>{' '}
                            <span className="font-medium">
                              {personalization.childAge} years
                            </span>
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
                              <span className="font-medium">
                                {personalization.book.title}
                              </span>
                            </div>
                          )}
                          {personalization.sticker && (
                            <div>
                              <span className="text-gray-500">Sticker:</span>{' '}
                              <span className="font-medium">
                                {personalization.sticker.title}
                              </span>
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
                        <p className="text-xs text-gray-500 mt-2">
                          Created: {new Date(personalization.createdAt).toLocaleDateString()}
                        </p>
                        {personalization.generatedBookUrl && (
                          <a
                            href={personalization.generatedBookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                          >
                            View Generated Book →
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Face Detection Data if available */}
                    {personalization.faceDetectionData && (
                      <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                        <p className="font-medium mb-1">Face Detection Data:</p>
                        <pre className="text-gray-600 overflow-auto">
                          {JSON.stringify(personalization.faceDetectionData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No personalizations found</p>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium">{orders?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Personalizations</span>
                <span className="font-medium">
                  {personalizations?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-medium">
                  $
                  {orders
                    ?.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
                    .toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


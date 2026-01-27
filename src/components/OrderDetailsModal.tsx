import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi, type OrderResponse, type OrderStatus } from '@lib/api/orders';
import { useState } from 'react';

interface OrderDetailsModalProps {
  order: OrderResponse;
  onClose: () => void;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800',
  processing: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800',
  shipped: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800',
  delivered: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800',
  cancelled: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800',
  refunded: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800',
};

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [notes, setNotes] = useState(order.notes || '');

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order.currencyCode || 'USD',
    }).format(amount);
  };

  const updateStatusMutation = useMutation({
    mutationFn: (data: { status: OrderStatus; trackingNumber?: string; notes?: string }) =>
      orderApi.updateStatus(order.orderNumber, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsEditMode(false);
      onClose();
    },
  });

  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({
      status: newStatus,
      trackingNumber: trackingNumber || undefined,
      notes: notes || undefined,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Order Details</h3>
              <p className="text-indigo-100 mt-1">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Order Items & Addresses */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                {order.user && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Name:</span>
                        <span className="text-gray-900 font-semibold">{order.user.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Email:</span>
                        <span className="text-gray-900">{order.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">User ID:</span>
                        <span className="text-gray-500 text-sm font-mono">{order.user.id}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guest Order Notice */}
                {!order.user && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-lg font-semibold text-amber-900">Guest Order</h4>
                        <p className="text-amber-700 text-sm mt-1">This order was placed without user registration.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Items ({order.items.length})
                  </h4>
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          {item.bookCoverImageUrl && (
                            <div className="flex-shrink-0">
                              <img
                                src={item.bookCoverImageUrl}
                                alt={item.bookTitle || 'Book cover'}
                                className="w-24 h-32 object-cover rounded-lg shadow-md"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/96x128?text=No+Image';
                                }}
                              />
                            </div>
                          )}

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900 text-lg">
                                  {item.bookTitle || item.stickerTitle || 'Unknown Product'}
                                </h5>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-gray-500">
                                    {item.bookId ? '📚 Book' : item.stickerId ? '🏷️ Sticker' : 'Unknown'} • Qty: {item.quantity}
                                  </span>
                                  {item.discountPercentage > 0 && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                      {item.discountPercentage}% OFF
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900 text-lg">{formatPrice(item.subtotal)}</p>
                                <p className="text-sm text-gray-500">{formatPrice(item.unitPrice)} each</p>
                              </div>
                            </div>

                            {/* Personalization Details */}
                            {item.personalization && (
                              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                                <div className="flex items-start gap-4">
                                  {/* Child Photo */}
                                  {item.personalization.childPhotoUrl && (
                                    <div className="flex-shrink-0">
                                      <img
                                        src={item.personalization.childPhotoUrl}
                                        alt={`${item.personalization.childFirstName}'s photo`}
                                        className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md"
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://via.placeholder.com/64?text=👤';
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Child Information */}
                                  <div className="flex-1">
                                    <h6 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-1 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Personalized for
                                    </h6>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="text-gray-600 font-medium">Child Name:</span>
                                        <p className="text-gray-900 font-semibold">{item.personalization.childFirstName}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600 font-medium">Age:</span>
                                        <p className="text-gray-900 font-semibold">{item.personalization.childAge} years old</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600 font-medium">Language:</span>
                                        <p className="text-gray-900 font-semibold uppercase">{item.personalization.languageCode}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600 font-medium">Status:</span>
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded capitalize ${item.personalization.status === 'completed' ? 'bg-green-100 text-green-700' :
                                          item.personalization.status === 'generating' ? 'bg-blue-100 text-blue-700' :
                                            item.personalization.status === 'approved' ? 'bg-purple-100 text-purple-700' :
                                              'bg-gray-100 text-gray-700'
                                          }`}>
                                          {item.personalization.status}
                                        </span>
                                      </div>
                                    </div>
                                    {item.personalization.generatedBookUrl && (
                                      <div className="mt-3">
                                        <a
                                          href={item.personalization.generatedBookUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                          View Generated Book
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Book Images Gallery */}
                            {item.bookImages && item.bookImages.length > 0 && (
                              <div className="mt-4">
                                <h6 className="text-sm font-semibold text-gray-700 mb-2">Book Preview Images</h6>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                  {item.bookImages
                                    .filter(img => img.imageType !== 'cover')
                                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                                    .slice(0, 5)
                                    .map((image) => (
                                      <div key={image.id} className="flex-shrink-0">
                                        <img
                                          src={image.imageUrl}
                                          alt={image.altText || 'Book preview'}
                                          className="w-20 h-20 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                                          onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/80?text=📖';
                                          }}
                                          onClick={() => window.open(image.imageUrl, '_blank')}
                                          title={`Click to view full image (${image.imageType})`}
                                        />
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {/* Product IDs for reference */}
                            <div className="mt-3 text-xs text-gray-500 space-y-1">
                              {item.bookId && (
                                <p>
                                  <span className="font-medium">Book ID:</span>{' '}
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{item.bookId}</span>
                                </p>
                              )}
                              {item.personalizationId && (
                                <p>
                                  <span className="font-medium">Personalization ID:</span>{' '}
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{item.personalizationId}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shipping Address */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.streetAddress}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && <p className="font-medium mt-2">📞 {order.shippingAddress.phone}</p>}
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Billing Address
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-semibold text-gray-900">{order.billingAddress.fullName}</p>
                      <p>{order.billingAddress.streetAddress}</p>
                      <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
                      <p>{order.billingAddress.country}</p>
                      {order.billingAddress.phone && <p className="font-medium mt-2">📞 {order.billingAddress.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary & Status */}
              <div className="space-y-6">
                {/* Order Status */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h4>

                  {!isEditMode ? (
                    <div>
                      <div className="mb-4">
                        <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${statusColors[order.status]}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Update Status
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="Enter tracking number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                          placeholder="Add notes..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateStatus}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {updateStatusMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setIsEditMode(false)}
                          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Tracking Number:</p>
                      <p className="text-sm text-gray-900 font-mono mt-1 bg-gray-50 px-3 py-2 rounded">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>

                {/* Delivery Type */}
                {order.deliveryType && (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Delivery Type
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Name</p>
                        <p className="text-base font-semibold text-gray-900">{order.deliveryType.name}</p>
                      </div>
                      {order.deliveryType.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Description</p>
                          <p className="text-sm text-gray-700">{order.deliveryType.description}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Price</p>
                          <p className="text-base font-semibold text-gray-900">{formatPrice(order.deliveryType.price)}</p>
                        </div>
                        {order.deliveryType.estimatedDays && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Est. Days</p>
                            <p className="text-base font-semibold text-gray-900">{order.deliveryType.estimatedDays} days</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping ({order.shippingMethod}):</span>
                      <span className="font-medium text-gray-900">{formatPrice(order.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium text-gray-900">{formatPrice(order.tax)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span className="font-medium">-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t border-indigo-200 pt-3">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-indigo-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Info</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' :
                        order.paymentStatus === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                        {order.paymentStatus?.toUpperCase()}
                      </span>
                    </div>
                    {order.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                      </div>
                    )}
                    {order.paymentTransactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded">{order.paymentTransactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Dates */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Dates</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Order Placed:</p>
                      <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                    {order.estimatedDeliveryDate && (
                      <div>
                        <p className="text-gray-600 font-medium">Est. Delivery:</p>
                        <p className="text-gray-900">{formatDate(order.estimatedDeliveryDate)}</p>
                      </div>
                    )}
                    {order.actualDeliveryDate && (
                      <div>
                        <p className="text-gray-600 font-medium">Delivered On:</p>
                        <p className="text-green-600 font-semibold">{formatDate(order.actualDeliveryDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 flex justify-end border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

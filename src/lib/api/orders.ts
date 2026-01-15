import apiClient from './client';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface AddressInfo {
  id: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface BookImageInfo {
  id: string;
  imageUrl: string;
  imageType: string;
  displayOrder: number;
  altText?: string;
}

export interface PersonalizationInfo {
  id: string;
  childFirstName: string;
  childAge: number;
  childPhotoUrl: string;
  languageCode: string;
  status: string;
  generatedBookUrl?: string;
}

export interface OrderItem {
  id: string;
  bookId?: string;
  bookTitle?: string;
  bookSlug?: string;
  bookCoverImageUrl?: string;
  bookImages?: BookImageInfo[];
  stickerId?: string;
  stickerTitle?: string;
  stickerSlug?: string;
  personalizationId?: string;
  personalization?: PersonalizationInfo;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  subtotal: number;
}

export interface DeliveryTypeInfo {
  name: string;
  description?: string;
  price: number;
  estimatedDays?: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId?: string;
  user?: UserInfo;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currencyCode: string;
  shippingMethod: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress: AddressInfo;
  billingAddress: AddressInfo;
  paymentMethod?: string;
  paymentTransactionId?: string;
  deliveryType?: DeliveryTypeInfo;
}

export interface OrderListResponse {
  items: OrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export const orderApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
  }): Promise<OrderListResponse> => {
    const response = await apiClient.get('/admin/orders', { params });
    return response.data;
  },

  getByOrderNumber: async (orderNumber: string): Promise<OrderResponse> => {
    const response = await apiClient.get(`/admin/orders/${orderNumber}`);
    return response.data;
  },

  updateStatus: async (orderNumber: string, data: UpdateOrderStatusRequest): Promise<OrderResponse> => {
    const response = await apiClient.put(`/admin/orders/${orderNumber}/status`, data);
    return response.data;
  },
};


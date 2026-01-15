import apiClient from './client';

export interface DeliveryType {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays?: number;
  isActive: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryTypeListResponse {
  items: DeliveryType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateDeliveryTypeRequest {
  name: string;
  description?: string;
  price: number;
  estimatedDays?: number;
  isActive?: boolean;
  displayOrder?: number;
}

export const deliveryTypeApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<DeliveryTypeListResponse> => {
    const response = await apiClient.get('/admin/delivery-types', { params });
    return response.data;
  },

  getById: async (id: string): Promise<DeliveryType> => {
    const response = await apiClient.get(`/admin/delivery-types/${id}`);
    return response.data;
  },

  create: async (data: CreateDeliveryTypeRequest): Promise<DeliveryType> => {
    const response = await apiClient.post('/admin/delivery-types', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateDeliveryTypeRequest>): Promise<DeliveryType> => {
    const response = await apiClient.put(`/admin/delivery-types/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/delivery-types/${id}`);
  },
};

import apiClient from './client';

export interface StickerListItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  packType: string;
  ageMin: number;
  ageMax: number;
  basePrice: number;
  discountPercentage?: number;
  finalPrice: number;
  previewImages?: string[];
}

export interface StickerListResponse {
  items: StickerListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateStickerRequest {
  title: string;
  slug: string;
  description?: string;
  packType: string;
  ageMin: number;
  ageMax: number;
  basePrice: number;
  discountPercentage?: number;
  previewImages?: string[];
}

export const stickerApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    pack_type?: string;
    age_min?: number;
    age_max?: number;
    sort?: string;
  }): Promise<StickerListResponse> => {
    const response = await apiClient.get('/stickers', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<StickerListItem> => {
    const response = await apiClient.get(`/stickers/${slug}`);
    return response.data;
  },

  create: async (data: CreateStickerRequest): Promise<StickerListItem> => {
    const response = await apiClient.post('/admin/stickers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateStickerRequest>): Promise<StickerListItem> => {
    const response = await apiClient.put(`/admin/stickers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/stickers/${id}`);
  },

  uploadImage: async (stickerId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/admin/stickers/${stickerId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};


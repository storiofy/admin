import apiClient from './client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  isAdmin: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SpringPageResponse {
  content: User[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UserDetailResponse extends User {
  orders?: any[];
  personalizations?: Personalization[];
}

export interface Personalization {
  id: string;
  childFirstName: string;
  childAge: number;
  childPhotoUrl: string;
  languageCode: string;
  status: string;
  book?: {
    id: string;
    title: string;
    slug: string;
  };
  sticker?: {
    id: string;
    title: string;
    slug: string;
  };
  previewData?: any;
  faceDetectionData?: any;
  generatedBookUrl?: string;
  createdAt: string;
}

export const userApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<UserListResponse> => {
    // Convert 1-indexed page to 0-indexed for Spring Boot API
    const apiParams = {
      ...params,
      page: params?.page !== undefined ? params.page - 1 : 0,
    };
    const response = await apiClient.get<SpringPageResponse>('/admin/users', { params: apiParams });
    const springPageData = response.data;
    
    // Transform Spring Boot Page response to our expected format
    return {
      items: springPageData.content || [],
      pagination: {
        page: springPageData.number + 1, // Convert back to 1-indexed
        limit: springPageData.size || springPageData.pageable.pageSize,
        total: springPageData.totalElements,
        totalPages: springPageData.totalPages,
      },
    };
  },

  getById: async (id: string): Promise<UserDetailResponse> => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  getUserOrders: async (userId: string): Promise<any[]> => {
    const response = await apiClient.get(`/admin/users/${userId}/orders`);
    return response.data;
  },

  getUserPersonalizations: async (userId: string): Promise<Personalization[]> => {
    const response = await apiClient.get(`/admin/users/${userId}/personalizations`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },
};


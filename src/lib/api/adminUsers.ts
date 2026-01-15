import apiClient from './client';
import type { AdminRole } from '../permissions';

export interface AdminUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  createdByName?: string;
}

export interface CreateAdminUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface UpdateAdminUserRoleRequest {
  role: AdminRole;
}

export interface AdminUsersResponse {
  items: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export const adminUserApi = {
  // Get all admin users
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<AdminUsersResponse> => {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', sortDirection = 'DESC' } = params || {};
    
    const queryParams = new URLSearchParams({
      page: (page - 1).toString(), // Backend uses 0-based pagination
      limit: limit.toString(),
      sortBy,
      sortDirection,
    });
    
    if (search) {
      queryParams.append('search', search);
    }
    
    const response = await apiClient.get(`/admin/admin-users?${queryParams.toString()}`);
    
    return {
      items: response.data.content,
      pagination: {
        page: response.data.number + 1, // Convert back to 1-based
        limit: response.data.size,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalElements,
      },
    };
  },

  // Get admin user by ID
  getById: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get(`/admin/admin-users/${id}`);
    return response.data;
  },

  // Get current admin user
  getCurrentAdminUser: async (): Promise<AdminUser> => {
    const response = await apiClient.get('/admin/admin-users/me');
    return response.data;
  },

  // Create new admin user
  create: async (data: CreateAdminUserRequest): Promise<AdminUser> => {
    const response = await apiClient.post('/admin/admin-users', data);
    return response.data;
  },

  // Update admin user role
  updateRole: async (id: string, data: UpdateAdminUserRoleRequest): Promise<AdminUser> => {
    const response = await apiClient.patch(`/admin/admin-users/${id}/role`, data);
    return response.data;
  },

  // Toggle admin user status
  toggleStatus: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.patch(`/admin/admin-users/${id}/toggle-status`);
    return response.data;
  },

  // Delete admin user
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/admin-users/${id}`);
  },

  // Check admin access
  checkAccess: async (): Promise<boolean> => {
    const response = await apiClient.get('/admin/admin-users/check-access');
    return response.data;
  },
};

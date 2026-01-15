import apiClient from './client';

export interface BookListItem {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  coverImageUrl?: string;
  idealFor: string;
  ageMin: number;
  ageMax: number;
  genre?: string;
  pageCount?: number;
  basePrice: number;
  discountPercentage?: number;
  finalPrice: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export interface BookListResponse {
  items: BookListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BookDetailResponse extends BookListItem {
  description?: string;
  additionalImageUrls?: string[];
  videoUrls?: string[];
}

export interface CreateBookRequest {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  genre?: string;
  idealFor: string;
  ageMin: number;
  ageMax: number;
  pageCount: number;
  basePrice: number;
  discountPercentage?: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  displayOrder?: number;
}

export interface CreateBookWithFilesRequest extends CreateBookRequest {
  coverImage?: File;
  additionalImages?: File[];
  videos?: File[];
}

export const bookApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    ideal_for?: string;
    age_min?: number;
    age_max?: number;
    featured?: string;
    sort?: string;
  }): Promise<BookListResponse> => {
    const response = await apiClient.get('/admin/books', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<BookDetailResponse> => {
    const response = await apiClient.get(`/books/${slug}`);
    return response.data;
  },

  getById: async (id: string): Promise<BookDetailResponse> => {
    const response = await apiClient.get(`/admin/books/${id}`);
    return response.data;
  },

  create: async (data: CreateBookRequest | CreateBookWithFilesRequest): Promise<BookDetailResponse> => {
    // Check if this request includes files
    const withFiles = data as CreateBookWithFilesRequest;
    const hasFiles = withFiles.coverImage || 
                     (withFiles.additionalImages && withFiles.additionalImages.length > 0) ||
                     (withFiles.videos && withFiles.videos.length > 0);

    if (hasFiles) {
      // Send as multipart/form-data with files
      const formData = new FormData();
      
      // Add book data as JSON string
      const { coverImage, additionalImages, videos, ...bookData } = withFiles;
      formData.append('book', JSON.stringify(bookData));
      
      // Add cover image if provided
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      
      // Add additional images if provided
      if (additionalImages && additionalImages.length > 0) {
        additionalImages.forEach((image) => {
          formData.append('additionalImages', image);
        });
      }
      
      // Add videos if provided
      if (videos && videos.length > 0) {
        videos.forEach((video) => {
          formData.append('videos', video);
        });
      }
      
      const response = await apiClient.post('/admin/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Send as regular JSON (backward compatibility)
      const response = await apiClient.post('/admin/books', data);
      return response.data;
    }
  },

  update: async (id: string, data: Partial<CreateBookRequest>): Promise<BookDetailResponse> => {
    const response = await apiClient.put(`/admin/books/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/books/${id}`);
  },

  uploadImage: async (bookId: string, file: File, type: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await apiClient.post(`/admin/books/${bookId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};


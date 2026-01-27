import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '@lib/api/books';
import type { CreateBookRequest, CreateBookWithFilesRequest } from '@lib/api/books';

interface BookCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookCreateModal({ isOpen, onClose }: BookCreateModalProps) {
  const queryClient = useQueryClient();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<CreateBookRequest>({
    defaultValues: {
      idealFor: 'Both',
      ageMin: 0,
      ageMax: 18,
      discountPercentage: 0,
      currencyPrices: {
        THB: 0,
        USD: 0,
        INR: 0,
      },
    },
  });

  const discountPercentage = watch('discountPercentage') || 0;
  const prices = watch('currencyPrices') || { THB: 0, USD: 0, INR: 0 };

  const finalPrices = {
    THB: (prices.THB || 0) * (1 - discountPercentage / 100),
    USD: (prices.USD || 0) * (1 - discountPercentage / 100),
    INR: (prices.INR || 0) * (1 - discountPercentage / 100),
  };

  const createMutation = useMutation({
    mutationFn: bookApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      // Reset form and close modal
      reset();
      setCoverImage(null);
      setAdditionalImages([]);
      setVideos([]);
      onClose();
    },
  });

  const onSubmit = async (data: CreateBookRequest) => {
    try {
      // Create book with files in a single request
      const requestWithFiles: CreateBookWithFilesRequest = {
        ...data,
        coverImage: coverImage || undefined,
        additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
        videos: videos.length > 0 ? videos : undefined,
      };
      await createMutation.mutateAsync(requestWithFiles);
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAdditionalImages(Array.from(e.target.files));
    }
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos(Array.from(e.target.files));
    }
  };

  const handleClose = () => {
    reset();
    setCoverImage(null);
    setAdditionalImages([]);
    setVideos([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleClose}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        {/* Modal panel */}
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-900">Create New Book</h3>
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
                    Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    {...register('slug', { required: 'Slug is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    {...register('shortDescription')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ideal For *
                    </label>
                    <select
                      {...register('idealFor', { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genre
                    </label>
                    <input
                      {...register('genre')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Min *
                    </label>
                    <input
                      type="number"
                      {...register('ageMin', { required: true, valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Max *
                    </label>
                    <input
                      type="number"
                      {...register('ageMax', { required: true, valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Count *
                    </label>
                    <input
                      type="number"
                      {...register('pageCount', { required: true, valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (THB) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('currencyPrices.THB', { required: true, valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Final: ฿{finalPrices.THB.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('currencyPrices.USD', { required: true, valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Final: ${finalPrices.USD.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (INR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('currencyPrices.INR', { required: true, valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Final: ₹{finalPrices.INR.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount %
                    </label>
                    <input
                      type="number"
                      {...register('discountPercentage', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isBestseller')}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Bestseller</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {coverImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Cover Preview"
                        className="h-32 w-auto object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {additionalImages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {additionalImages.map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Additional Image ${index + 1}`}
                          className="h-24 w-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Videos
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideosChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {videos.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {videos.length} video(s) selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Book'}
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


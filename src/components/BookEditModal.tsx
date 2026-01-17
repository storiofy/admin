import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '@lib/api/books';
import type { CreateBookRequest } from '@lib/api/books';

interface BookEditModalProps {
  bookId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookEditModal({ bookId, isOpen, onClose }: BookEditModalProps) {
  const queryClient = useQueryClient();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getById(bookId),
    enabled: isOpen && !!bookId,
  });

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<CreateBookRequest>({
    defaultValues: {
      idealFor: 'Both',
      ageMin: 0,
      ageMax: 18,
      discountPercentage: 0,
    },
  });

  // Reset form when book data loads
  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        slug: book.slug,
        shortDescription: book.shortDescription || '',
        description: book.description || '',
        idealFor: book.idealFor,
        genre: book.genre || '',
        ageMin: book.ageMin,
        ageMax: book.ageMax,
        pageCount: book.pageCount || 0,
        basePrice: book.basePrice,
        discountPercentage: book.discountPercentage || 0,
        isFeatured: book.isFeatured || false,
        isBestseller: book.isBestseller || false,
      });
    }
  }, [book, reset]);

  const discountPercentage = watch('discountPercentage') || 0;
  const basePrice = watch('basePrice') || 0;
  const finalPrice = basePrice * (1 - discountPercentage / 100);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateBookRequest>) => bookApi.update(bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      onClose();
    },
  });

  const onSubmit = async (data: CreateBookRequest) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
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
              <h3 className="text-2xl font-bold text-gray-900">Edit Book</h3>
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
          {isLoading ? (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="text-center py-8">Loading...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Cover Image Preview */}
                  {book?.coverImageUrl && (
                    <div className="flex justify-center">
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="h-32 w-auto rounded-lg object-cover"
                      />
                    </div>
                  )}

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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('basePrice', { required: true, valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Final Price
                      </label>
                      <input
                        type="text"
                        value={`$${finalPrice.toFixed(2)}`}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
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

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCoverImage(e.target.files[0]);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {(coverImage || book?.coverImageUrl) && (
                      <div className="mt-2">
                        <img
                          src={coverImage ? URL.createObjectURL(coverImage) : book?.coverImageUrl}
                          alt="Cover Preview"
                          className="h-32 w-auto object-cover rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images
                    </label>
                    {book?.additionalImageUrls && book.additionalImageUrls.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {book.additionalImageUrls.map((imageUrl, index) => (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`Additional image ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setAdditionalImages(Array.from(e.target.files));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {additionalImages.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {additionalImages.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`New Additional Image ${index + 1}`}
                            className="h-24 w-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Videos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Videos
                    </label>
                    {book?.videoUrls && book.videoUrls.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">Existing Videos:</p>
                        <div className="space-y-2">
                          {book.videoUrls.map((videoUrl, index) => (
                            <video
                              key={index}
                              src={videoUrl}
                              controls
                              className="w-full max-w-md rounded"
                            >
                              Your browser does not support the video tag.
                            </video>
                          ))}
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setVideos(Array.from(e.target.files));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {videos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {videos.length} new video(s) selected
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
                  disabled={updateMutation.isPending}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Book'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


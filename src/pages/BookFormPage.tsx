import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '@lib/api/books';
import type { CreateBookRequest, CreateBookWithFilesRequest } from '@lib/api/books';

export default function BookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateBookRequest>({
    defaultValues: {
      idealFor: 'Both',
      ageMin: 0,
      ageMax: 18,
      discountPercentage: 0,
    },
  });

  const { data: book } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookApi.getBySlug(id!),
    enabled: isEdit && !!id,
  });

  const discountPercentage = watch('discountPercentage') || 0;
  const basePrice = watch('basePrice') || 0;
  const finalPrice = basePrice * (1 - discountPercentage / 100);

  const createMutation = useMutation({
    mutationFn: bookApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      navigate('/books');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateBookRequest>) => bookApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      navigate('/books');
    },
  });

  const onSubmit = async (data: CreateBookRequest) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(data);
      } else {
        // Create book with files in a single request
        const requestWithFiles: CreateBookWithFilesRequest = {
          ...data,
          coverImage: coverImage || undefined,
          additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
          videos: videos.length > 0 ? videos : undefined,
        };
        await createMutation.mutateAsync(requestWithFiles);
      }
    } catch (error) {
      console.error('Error saving book:', error);
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'Edit Book' : 'Create New Book'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            defaultValue={book?.title}
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
            defaultValue={book?.slug}
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
            defaultValue={book?.shortDescription}
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
            defaultValue={book?.description}
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
              defaultValue={book?.idealFor || 'Both'}
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
              defaultValue={book?.genre}
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
              defaultValue={book?.ageMin || 0}
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
              defaultValue={book?.ageMax || 18}
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
              defaultValue={book?.pageCount}
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
              defaultValue={book?.basePrice}
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
              defaultValue={book?.discountPercentage || 0}
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
                className="h-32 w-32 object-cover rounded"
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

        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEdit ? 'Update Book' : 'Create Book'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


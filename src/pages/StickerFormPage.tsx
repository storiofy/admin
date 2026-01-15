import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stickerApi } from '@lib/api/stickers';
import type { CreateStickerRequest } from '@lib/api/stickers';

export default function StickerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateStickerRequest>({
    defaultValues: {
      packType: 'boy',
      ageMin: 0,
      ageMax: 18,
      discountPercentage: 0,
    },
  });

  const { data: sticker } = useQuery({
    queryKey: ['sticker', id],
    queryFn: () => stickerApi.getBySlug(id!),
    enabled: isEdit && !!id,
  });

  const discountPercentage = watch('discountPercentage') || 0;
  const basePrice = watch('basePrice') || 0;
  const finalPrice = basePrice * (1 - discountPercentage / 100);

  const createMutation = useMutation({
    mutationFn: stickerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stickers'] });
      navigate('/stickers');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateStickerRequest>) => stickerApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stickers'] });
      navigate('/stickers');
    },
  });

  const onSubmit = async (data: CreateStickerRequest) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(data);
      } else {
        const result = await createMutation.mutateAsync(data);
        if (imageFiles.length > 0 && result.id) {
          for (const file of imageFiles) {
            await stickerApi.uploadImage(result.id, file);
          }
        }
      }
    } catch (error) {
      console.error('Error saving sticker:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'Edit Sticker' : 'Create New Sticker'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            defaultValue={sticker?.title}
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
            defaultValue={sticker?.slug}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            defaultValue={sticker?.description}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pack Type *
            </label>
            <select
              {...register('packType', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={sticker?.packType || 'boy'}
            >
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
            </select>
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
              defaultValue={sticker?.ageMin || 0}
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
              defaultValue={sticker?.ageMax || 18}
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
              defaultValue={sticker?.basePrice}
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
              defaultValue={sticker?.discountPercentage || 0}
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
            Preview Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {imageFiles.length > 0 && (
            <div className="mt-2 flex space-x-2">
              {imageFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-32 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEdit ? 'Update Sticker' : 'Create Sticker'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/stickers')}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


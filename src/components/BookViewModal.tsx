import type { BookDetailResponse } from '@lib/api/books';

interface BookViewModalProps {
  book: BookDetailResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookViewModal({ book, isOpen, onClose }: BookViewModalProps) {
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
              <h3 className="text-2xl font-bold text-gray-900">{book.title}</h3>
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
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Cover Image */}
              {book.coverImageUrl && (
                <div className="flex justify-center">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="h-64 w-auto rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <p className="mt-1 text-sm text-gray-900">{book.slug}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Genre</label>
                  <p className="mt-1 text-sm text-gray-900">{book.genre || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ideal For</label>
                  <p className="mt-1 text-sm text-gray-900">{book.idealFor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Page Count</label>
                  <p className="mt-1 text-sm text-gray-900">{book.pageCount || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age Range</label>
                  <p className="mt-1 text-sm text-gray-900">{book.ageMin} - {book.ageMax} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Price</label>
                  <p className="mt-1 text-sm text-gray-900">${book.basePrice.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount</label>
                  <p className="mt-1 text-sm text-gray-900">{book.discountPercentage || 0}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Final Price</label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">${book.finalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-4">
                {book.isFeatured && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {book.isBestseller && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Short Description */}
              {book.shortDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <p className="text-sm text-gray-900">{book.shortDescription}</p>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{book.description}</p>
                </div>
              )}

              {/* Additional Images */}
              {book.additionalImageUrls && book.additionalImageUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                  <div className="grid grid-cols-3 gap-4">
                    {book.additionalImageUrls.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Additional image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {book.videoUrls && book.videoUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Videos</label>
                  <div className="space-y-4">
                    {book.videoUrls.map((videoUrl, index) => (
                      <video
                        key={index}
                        src={videoUrl}
                        controls
                        className="w-full rounded-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


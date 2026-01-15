import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '@lib/api/books';
import type { BookListItem } from '@lib/api/books';
import BookViewModal from '@components/BookViewModal';
import BookEditModal from '@components/BookEditModal';
import BookCreateModal from '@components/BookCreateModal';

export default function BooksPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['books', page],
    queryFn: () => bookApi.getAll({ page, limit: 20 }),
  });

  const { data: selectedBook } = useQuery({
    queryKey: ['book', selectedBookId],
    queryFn: () => bookApi.getById(selectedBookId!),
    enabled: viewModalOpen && !!selectedBookId,
  });

  const deleteMutation = useMutation({
    mutationFn: bookApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      alert('Book deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting book:', error);
      alert(`Failed to delete book: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    },
  });

  const handleViewBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setViewModalOpen(true);
  };

  const handleEditBook = (bookId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBookId(bookId);
    setEditModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedBookId(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedBookId(null);
  };

  const handleDeleteBook = (bookId: string, bookTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
      deleteMutation.mutate(bookId);
    }
  };

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading books...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="p-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="ml-3 text-red-700 font-medium">Error loading books</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Books Management</h1>
            <p className="text-gray-600">Create and manage personalized storybooks</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Book
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data?.items.map((book: BookListItem) => (
              <tr key={book.id} className="hover:bg-indigo-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {book.coverImageUrl && (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="h-12 w-12 rounded-lg object-cover mr-3 shadow-md border border-gray-200"
                      />
                    )}
                    <div>
                      <button
                        onClick={() => handleViewBook(book.id)}
                        className="text-sm font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer text-left transition-colors"
                      >
                        {book.title}
                      </button>
                      {book.shortDescription && (
                        <div className="text-sm text-gray-500 mt-0.5">{book.shortDescription}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                  {book.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${book.finalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => handleEditBook(book.id, e)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteBook(book.id, book.title, e)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data && data.pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700">
              Showing page {data.pagination.page} of {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedBook && (
        <BookViewModal
          book={selectedBook}
          isOpen={viewModalOpen}
          onClose={handleCloseViewModal}
        />
      )}

      {/* Edit Modal */}
      {selectedBookId && (
        <BookEditModal
          bookId={selectedBookId}
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
        />
      )}

      {/* Create Modal */}
      <BookCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}


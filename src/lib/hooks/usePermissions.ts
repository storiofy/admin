import { useAuthStore } from '@store/authStore';
import { type AdminRole, hasPermission as checkPermission, type RolePermissions } from '@lib/permissions';

/**
 * Custom hook for checking permissions in components
 * Usage:
 * 
 * const { can, role } = usePermissions();
 * 
 * if (can('deleteBooks')) {
 *   // Show delete button
 * }
 */
export const usePermissions = () => {
  const { user } = useAuthStore();
  
  // Default to 'support' if no role is set (most restrictive)
  const role = (user?.isAdmin ? 'admin' : 'support') as AdminRole;
  
  const can = (permission: keyof RolePermissions): boolean => {
    return checkPermission(role, permission);
  };
  
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin' || role === 'owner';
  const isContentManager = role === 'content_manager' || role === 'admin' || role === 'owner';
  
  return {
    role,
    can,
    isOwner,
    isAdmin,
    isContentManager,
  };
};

// Example usage in a component:
/*
import { usePermissions } from '@lib/hooks/usePermissions';

export default function BooksList() {
  const { can } = usePermissions();
  
  return (
    <div>
      {can('createBooks') && (
        <button>Add New Book</button>
      )}
      
      {can('deleteBooks') && (
        <button>Delete</button>
      )}
    </div>
  );
}
*/

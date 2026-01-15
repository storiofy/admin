// Role types and permissions
export type AdminRole = 'owner' | 'admin' | 'content_manager' | 'support';

export interface RolePermissions {
  // Dashboard
  viewDashboard: boolean;
  
  // Books & Stickers
  viewBooks: boolean;
  createBooks: boolean;
  editBooks: boolean;
  deleteBooks: boolean;
  viewStickers: boolean;
  createStickers: boolean;
  editStickers: boolean;
  deleteStickers: boolean;
  
  // Orders
  viewOrders: boolean;
  updateOrderStatus: boolean;
  cancelOrders: boolean;
  refundOrders: boolean;
  
  // Users (Customers)
  viewUsers: boolean;
  editUsers: boolean;
  deleteUsers: boolean;
  
  // Admin Users
  viewAdminUsers: boolean;
  createAdminUsers: boolean;
  editAdminUsers: boolean;
  deleteAdminUsers: boolean;
  manageRoles: boolean;
  
  // Settings
  viewSettings: boolean;
  editSettings: boolean;
  
  // Analytics
  viewAnalytics: boolean;
  exportData: boolean;
}

export const rolePermissions: Record<AdminRole, RolePermissions> = {
  owner: {
    viewDashboard: true,
    viewBooks: true,
    createBooks: true,
    editBooks: true,
    deleteBooks: true,
    viewStickers: true,
    createStickers: true,
    editStickers: true,
    deleteStickers: true,
    viewOrders: true,
    updateOrderStatus: true,
    cancelOrders: true,
    refundOrders: true,
    viewUsers: true,
    editUsers: true,
    deleteUsers: true,
    viewAdminUsers: true,
    createAdminUsers: true,
    editAdminUsers: true,
    deleteAdminUsers: true,
    manageRoles: true,
    viewSettings: true,
    editSettings: true,
    viewAnalytics: true,
    exportData: true,
  },
  admin: {
    viewDashboard: true,
    viewBooks: true,
    createBooks: true,
    editBooks: true,
    deleteBooks: true,
    viewStickers: true,
    createStickers: true,
    editStickers: true,
    deleteStickers: true,
    viewOrders: true,
    updateOrderStatus: true,
    cancelOrders: true,
    refundOrders: true,
    viewUsers: true,
    editUsers: true,
    deleteUsers: true,
    viewAdminUsers: false,
    createAdminUsers: false,
    editAdminUsers: false,
    deleteAdminUsers: false,
    manageRoles: false,
    viewSettings: true,
    editSettings: false,
    viewAnalytics: true,
    exportData: true,
  },
  content_manager: {
    viewDashboard: true,
    viewBooks: true,
    createBooks: true,
    editBooks: true,
    deleteBooks: false,
    viewStickers: true,
    createStickers: true,
    editStickers: true,
    deleteStickers: false,
    viewOrders: true,
    updateOrderStatus: false,
    cancelOrders: false,
    refundOrders: false,
    viewUsers: true,
    editUsers: false,
    deleteUsers: false,
    viewAdminUsers: false,
    createAdminUsers: false,
    editAdminUsers: false,
    deleteAdminUsers: false,
    manageRoles: false,
    viewSettings: false,
    editSettings: false,
    viewAnalytics: true,
    exportData: false,
  },
  support: {
    viewDashboard: true,
    viewBooks: true,
    createBooks: false,
    editBooks: false,
    deleteBooks: false,
    viewStickers: true,
    createStickers: false,
    editStickers: false,
    deleteStickers: false,
    viewOrders: true,
    updateOrderStatus: true,
    cancelOrders: false,
    refundOrders: false,
    viewUsers: true,
    editUsers: false,
    deleteUsers: false,
    viewAdminUsers: false,
    createAdminUsers: false,
    editAdminUsers: false,
    deleteAdminUsers: false,
    manageRoles: false,
    viewSettings: false,
    editSettings: false,
    viewAnalytics: false,
    exportData: false,
  },
};

export const roleDetails: Record<AdminRole, { name: string; description: string; color: string }> = {
  owner: {
    name: 'Owner',
    description: 'Full system access with ability to manage all admins and critical settings',
    color: 'from-purple-500 to-pink-500',
  },
  admin: {
    name: 'Admin',
    description: 'Full operational access to manage books, orders, and customers',
    color: 'from-indigo-500 to-blue-500',
  },
  content_manager: {
    name: 'Content Manager',
    description: 'Can create and manage books and stickers, view orders and analytics',
    color: 'from-green-500 to-emerald-500',
  },
  support: {
    name: 'Support Staff',
    description: 'Can view and update order status, assist customers with inquiries',
    color: 'from-orange-500 to-amber-500',
  },
};

// Helper function to check permissions
export const hasPermission = (role: AdminRole, permission: keyof RolePermissions): boolean => {
  return rolePermissions[role][permission];
};

// Helper function to get role badge color
export const getRoleBadgeColor = (role: AdminRole): string => {
  const colors: Record<AdminRole, string> = {
    owner: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800',
    admin: 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800',
    content_manager: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800',
    support: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800',
  };
  return colors[role];
};

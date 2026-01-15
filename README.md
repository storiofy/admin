# Admin Portal - Storiofy

React.js admin dashboard for managing the Storiofy platform - a personalized children's books and stickers platform.

## 🚀 Tech Stack

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4 (Build tool)
- **React Router** 7.11.0 (Routing)
- **Tailwind CSS** 3.4.1 (Styling)
- **TanStack Query** 5.90.12 (Server state management)
- **Zustand** 5.0.9 (Client state management)
- **React Hook Form** 7.69.0 (Form handling)
- **Zod** 4.2.1 (Schema validation)
- **Axios** 1.13.2 (HTTP client)

## 📦 Installation

```bash
npm install
```

## 🏃 Development

Start the development server:

```bash
npm run dev
```

The admin portal will be available at `http://localhost:5174`

## 🏗️ Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
admin-portal/
├── src/
│   ├── pages/                    # Admin pages
│   │   ├── DashboardPage.tsx     # Analytics dashboard
│   │   ├── BooksPage.tsx         # Book listing
│   │   ├── BookFormPage.tsx      # Create/edit books
│   │   ├── StickersPage.tsx      # Sticker listing
│   │   ├── StickerFormPage.tsx   # Create/edit stickers
│   │   ├── OrdersPage.tsx          # Order listing
│   │   ├── OrderDetailPage.tsx   # Order details
│   │   ├── UsersPage.tsx         # Customer listing
│   │   ├── UserDetailPage.tsx    # Customer details
│   │   ├── AdminUsersPage.tsx    # Admin user management
│   │   ├── DeliveryTypesPage.tsx # Delivery type management
│   │   ├── SettingsPage.tsx      # Application settings
│   │   └── LoginPage.tsx         # Authentication
│   ├── components/               # Reusable components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Top navigation
│   │   │   └── Sidebar.tsx      # Side navigation
│   │   ├── BookCreateModal.tsx  # Book creation modal
│   │   ├── BookEditModal.tsx    # Book editing modal
│   │   ├── BookViewModal.tsx    # Book viewing modal
│   │   ├── OrderDetailsModal.tsx # Order details modal
│   │   ├── UserViewModal.tsx    # User viewing modal
│   │   ├── DeliveryTypeCreateModal.tsx
│   │   ├── DeliveryTypeEditModal.tsx
│   │   └── ProtectedRoute.tsx   # Route protection
│   ├── lib/                     # Utilities & API client
│   │   ├── api/                 # API endpoints
│   │   │   ├── client.ts        # Axios client configuration
│   │   │   ├── auth.ts          # Authentication APIs
│   │   │   ├── books.ts         # Book APIs
│   │   │   ├── stickers.ts      # Sticker APIs
│   │   │   ├── orders.ts        # Order APIs
│   │   │   ├── users.ts         # User APIs
│   │   │   ├── adminUsers.ts    # Admin user APIs
│   │   │   └── deliveryTypes.ts # Delivery type APIs
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── usePermissions.ts
│   │   └── permissions.ts       # Role-based permissions
│   ├── store/                   # State management
│   │   └── authStore.ts        # Authentication store (Zustand)
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
└── public/                      # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

The API client will use this URL for all backend requests. If not specified, it defaults to `http://localhost:8080/api/v1`.

## 📝 Available Scripts

- `npm run dev` - Start development server (port 5174)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📚 Admin Features

### Dashboard
- Analytics overview with key metrics
- Quick access to common actions
- Performance indicators

### Book Management
- View all books with pagination
- Create new personalized books
- Edit existing books
- Delete books
- View book details

### Sticker Management
- View all sticker packs
- Create new sticker packs
- Edit existing stickers
- Delete stickers
- Manage sticker inventory

### Order Management
- View all orders with filtering
- View detailed order information
- Update order status
- Cancel orders
- Process refunds
- Track order history

### User Management
- View all customer accounts
- View detailed user profiles
- Edit user information
- Manage user accounts

### Admin User Management
- View all admin users
- Create new admin accounts
- Edit admin user details
- Assign roles and permissions
- Delete admin users

### Delivery Types
- Manage shipping/delivery options
- Create new delivery types
- Edit delivery configurations
- Set delivery pricing

### Settings
- Application configuration
- Platform settings management

## 🔐 Authentication & Authorization

The admin portal uses role-based access control (RBAC) with the following roles:

- **Owner** - Full system access, can manage all admins and critical settings
- **Admin** - Full operational access to manage books, orders, and customers
- **Content Manager** - Can create and manage books/stickers, view orders and analytics
- **Support Staff** - Can view and update order status, assist customers

Each role has specific permissions that control access to features and actions within the portal. Authentication is handled via JWT tokens stored in localStorage.

## 🌐 API Integration

Connects to the Spring Boot backend API at `http://localhost:8080/api/v1` (configurable via environment variables).

The API client includes:
- Automatic token injection for authenticated requests
- Request/response interceptors
- Automatic redirect to login on 401 errors
- Error handling and retry logic

## 🐳 Docker Support

The project includes Docker configuration:
- `Dockerfile` - Production build
- `Dockerfile.dev` - Development environment
- `nginx.conf` - Nginx configuration for production

---

**Status:** ✅ Active Development  
**Port:** 5174  
**API Backend:** http://localhost:8080/api/v1  
**Access:** Admin authentication required

# AutoCare Parts Store

A modern, production-quality ecommerce frontend for automotive parts and consumables, built with React, TypeScript, and Tailwind CSS. This application is designed to be deployed on AWS with a separate backend implementation.

## Features

- 🛒 **Full Shopping Cart**: Persistent cart with guest support and server sync on login
- 🔐 **Authentication**: User registration, login, and role-based access control
- 📦 **Product Catalog**: 6 car parts with search, filters, and sorting
- 🚚 **Order Management**: Complete checkout flow with order tracking
- 👤 **User Accounts**: Order history and profile management
- 🛠️ **Admin Panel**: Product and order management for administrators
- 📱 **Responsive Design**: Mobile-first with brutalist aesthetic
- 🎨 **Mock API Mode**: Fully functional without a backend for development

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand (cart + auth)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd autocare-parts-store
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Mock Mode (set to 'true' for development without backend)
VITE_USE_MOCK=true
```

### Mock Mode

When `VITE_USE_MOCK=true`, the application runs with in-memory mock data:

- All API calls are intercepted and handled locally
- Cart persists to localStorage
- Demo accounts available:
  - **User**: user@demo.com / password123
  - **Admin**: admin@demo.com / password123

### Production Mode

When `VITE_USE_MOCK=false`, the app expects a real backend at `VITE_API_BASE_URL`. See [docs/api-contract.md](docs/api-contract.md) for the complete API specification.

## Project Structure

```
src/
├── api/              # API client and service functions
│   ├── client.ts     # Base HTTP client with interceptors
│   ├── auth.ts       # Authentication endpoints
│   ├── products.ts   # Product endpoints
│   ├── cart.ts       # Cart endpoints
│   ├── orders.ts     # Order endpoints
│   └── inquiries.ts  # Contact form endpoints
├── components/       # Reusable UI components
│   ├── layout/       # Navbar, Footer
│   ├── products/     # ProductCard
│   ├── cart/         # CartItem
│   ├── orders/       # OrderStatusBadge, OrderTimeline
│   └── ui/           # shadcn/ui components
├── pages/            # Route pages
│   ├── admin/        # Admin dashboard, products, orders
│   └── help/         # Help and policy pages
├── stores/           # Zustand state stores
│   ├── auth-store.ts
│   └── cart-store.ts
├── types/            # TypeScript type definitions
├── lib/              # Utility functions
│   ├── mock-data.ts  # Mock product/user data
│   └── format.ts     # Price/date formatting
└── App.tsx           # Main app with routing

## Key Features

### Shopping Cart

- **Guest Cart**: Works without login, persists in localStorage
- **Quantity Controls**: Min/max validation based on stock
- **Auto-Calculate**: Subtotal, shipping fee (฿60, free over ฿1,000), total
- **Cart Sync**: Merges guest cart into server cart on login

### Authentication

- **Zustand + localStorage**: Session persistence
- **Protected Routes**: Role-based access (USER, ADMIN)
- **Auto Token Injection**: JWT sent with all API requests

### Product Catalog

- **6 Products**: Engine oil, air filter, brake pads, coolant, battery, tire
- **Filters**: Category, brand, price range, compatibility
- **Search**: Full-text search across name, description, SKU
- **Sort**: Featured, price (asc/desc), newest

### Checkout Flow

- **3-Step Process**: Shipping address → Payment method → Review
- **Payment Methods**: QR/Transfer, Credit Card (mock), COD
- **Validation**: React Hook Form + Zod schemas

### Order Tracking

- **Public Tracking**: By order number + email
- **Status Timeline**: Visual progress indicator
- **Order History**: Full details for logged-in users

### Admin Panel

- **Product Management**: View, edit, delete (CRUD UI ready)
- **Order Management**: Update order status
- **Role Guard**: Admin-only access

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## AWS Deployment

This frontend is designed to be deployed as a static site on AWS:

### Option 1: S3 + CloudFront

1. Build the app: `npm run build`
2. Upload `dist/` contents to S3 bucket
3. Create CloudFront distribution pointing to S3
4. Configure environment variables for production API

### Option 2: Amplify Hosting

1. Connect repository to AWS Amplify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Amplify console

### Option 3: Behind ALB

1. Build as static files
2. Serve via Nginx or similar
3. Configure ALB to route traffic

**Important**: Set `VITE_USE_MOCK=false` and point `VITE_API_BASE_URL` to your production backend.

## API Integration

When ready to connect to a real backend:

1. Set `VITE_USE_MOCK=false` in `.env`
2. Set `VITE_API_BASE_URL` to your backend URL
3. Implement the REST API according to [docs/api-contract.md](docs/api-contract.md)

The frontend is designed to work with any backend that implements the contract. The API client in `src/api/client.ts` handles:

- Automatic JWT token injection
- Error handling and retries
- Request/response interceptors

## Demo Accounts

In mock mode, use these credentials:

- **Regular User**
  - Email: user@demo.com
  - Password: password123

- **Administrator**
  - Email: admin@demo.com
  - Password: password123

## Development

### Type Safety

All API responses and data structures are fully typed. See `src/types/index.ts` for the complete schema.

### Code Style

- ESLint for code quality
- TypeScript for type safety
- Prettier for formatting (recommended)

### Adding New Products

Edit `src/lib/mock-data.ts` to add more products to the mock catalog.

## License

This project is part of the AutoCare Parts Store ecommerce platform.

## Support

For issues or questions, visit the [help center](/help/contact) or contact support@autocare.com.

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdById: string;
  creatorEmail: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationData {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IProductApiResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination: PaginationData;
  };
}

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdById: string;
  creatorEmail: string;
  createdAt?: string;
  updatedAt?: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  email: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
/**
 * Tipos e interfaces del dominio de pruebas UI (Tricentis Demo Web Shop)
 * y pruebas de Servicios Web / API (Mercado Libre).
 */

export type Gender = 'Male' | 'Female';

export interface RegisterUserData {
  gender: Gender;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProductTestData {
  name: string;
  urlPath: string;
  unitPrice: number;
}

export interface CartItemExpectation {
  product: ProductTestData;
  quantity: number;
  expectedSubtotal: number;
}

/**
 * Interfaces para respuestas del Servicio Web de Mercado Libre
 * Endpoint: GET https://www.mercadolibre.com.ar/menu/departments
 */
export interface MercadoLibreCategory {
  id?: string;
  name: string;
  permalink?: string;
}

export interface MercadoLibreDepartment {
  name: string;
  categories?: MercadoLibreCategory[];
}

export interface MercadoLibreDepartmentsResponse {
  departments: MercadoLibreDepartment[];
  landings?: unknown[];
  more_categories?: unknown;
  high_priority?: unknown[];
}

/**
 * Tipos e interfaces del dominio de pruebas para Tricentis Demo Web Shop.
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

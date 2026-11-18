import { LoginCredentials, ProductTestData, RegisterUserData } from '../types';

/**
 * Genera un correo único para pruebas de registro (AUT-REG-01).
 */
export function generateUniqueTestEmail(prefix = 'qa.test.user'): string {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${prefix}.${timestamp}.${randomSuffix}@jbsze.com`;
}

/**
 * Datos base para registro de usuario nuevo (AUT-REG-01).
 */
export function buildNewRegisterUser(email = generateUniqueTestEmail()): RegisterUserData {
  return {
    gender: 'Male',
    firstName: 'Test',
    lastName: 'Test',
    email,
    password: 'Testing123',
    confirmPassword: 'Testing123',
  };
}

/**
 * Datos para registro con email ya existente en el sistema (AUT-REG-02).
 */
export const DUPLICATE_REGISTER_USER: RegisterUserData = {
  gender: 'Male',
  firstName: 'TestDupe',
  lastName: 'TestDupe',
  email: 'vzfldljdpixuocifoz@jbsze.com',
  password: 'Testing123',
  confirmPassword: 'Testing123',
};

/**
 * Credenciales válidas especificadas en el Plan de Pruebas (LOGIN-01 / AUT-LOGIN-01).
 */
export const VALID_LOGIN_CREDENTIALS: LoginCredentials = {
  email: 'vzfldljdpixuocifoz@jbsze.com',
  password: 'Testing123',
};

/**
 * Credenciales con contraseña incorrecta (LOGIN-02 / AUT-LOGIN-02).
 */
export const INVALID_LOGIN_CREDENTIALS: LoginCredentials = {
  email: 'vzfldljdpixuocifoz@jbsze.com',
  password: 'Testing111',
};

/**
 * Catálogo de productos de prueba (Módulo Carrito de Compras).
 */
export const TEST_PRODUCTS: Record<'ITEM_A' | 'ITEM_B' | 'ITEM_C', ProductTestData> = {
  ITEM_A: {
    name: 'Computing and Internet',
    urlPath: '/computing-and-internet',
    unitPrice: 10.0,
  },
  ITEM_B: {
    name: 'Fiction',
    urlPath: '/fiction',
    unitPrice: 24.0,
  },
  ITEM_C: {
    name: 'Health Book',
    urlPath: '/health',
    unitPrice: 10.0,
  },
};

/**
 * Endpoints de Servicios Web (API Testing).
 */
export const API_ENDPOINTS = {
  MERCADOLIBRE_DEPARTMENTS: 'https://www.mercadolibre.com.ar/menu/departments',
} as const;

/**
 * Mensajes de error esperados según especificación funcional y casos de prueba.
 */
export const EXPECTED_MESSAGES = {
  DUPLICATE_EMAIL_ERROR: 'The specified email already exists',
  LOGIN_UNSUCCESSFUL_SUMMARY: 'Login was unsuccessful. Please correct the errors and try again.',
  LOGIN_INVALID_CREDENTIALS_DETAIL: 'The credentials provided are incorrect',
  CART_MAX_QTY_EXCEEDED: 'The maximum quantity allowed for purchase is 10000.',
} as const;

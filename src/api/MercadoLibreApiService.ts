import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_ENDPOINTS } from '../data/testData';
import { MercadoLibreDepartmentsResponse } from '../types';
import { BaseApiClient } from './BaseApiClient';

/**
 * Servicio especializado para consumir los endpoints públicos de Mercado Libre.
 */
export class MercadoLibreApiService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Consulta el servicio GET https://www.mercadolibre.com.ar/menu/departments
   * y devuelve tanto la respuesta HTTP cruda como el cuerpo JSON tipado.
   */
  async getDepartments(): Promise<{
    response: APIResponse;
    body: MercadoLibreDepartmentsResponse;
  }> {
    const response = await this.get(API_ENDPOINTS.MERCADOLIBRE_DEPARTMENTS);
    const body = (await response.json()) as MercadoLibreDepartmentsResponse;
    return { response, body };
  }
}

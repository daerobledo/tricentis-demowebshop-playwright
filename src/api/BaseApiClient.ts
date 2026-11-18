import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Cliente base modular para interactuar con servicios web REST (API Testing)
 * utilizando el APIRequestContext nativo de Playwright.
 */
export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly defaultHeaders: Record<string, string>;

  constructor(request: APIRequestContext, defaultHeaders: Record<string, string> = {}) {
    this.request = request;
    this.defaultHeaders = {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      ...defaultHeaders,
    };
  }

  /**
   * Ejecuta una petición HTTP GET sobre la URL o endpoint indicado.
   */
  async get(
    url: string,
    options?: { headers?: Record<string, string>; params?: Record<string, string | number | boolean> }
  ): Promise<APIResponse> {
    return this.request.get(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
      params: options?.params,
    });
  }

  /**
   * Ejecuta una petición HTTP POST enviando un payload JSON.
   */
  async post<TPayload>(
    url: string,
    data: TPayload,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    return this.request.post(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...options?.headers,
      },
    });
  }
}

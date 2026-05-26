/**
 * Cliente HTTP base. Las páginas no usan fetch directo.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '/api';

export function authHeaders(userId) {
  return {
    'Content-Type': 'application/json',
    'X-User-Id': String(userId)
  };
}

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    let message = fallbackMessage;
    const contentType = response.headers.get('content-type') ?? '';

    try {
      if (contentType.includes('application/json')) {
        const error = await response.json();
        message =
          error.message ??
          error.detail ??
          error.error ??
          error.title ??
          (Array.isArray(error.errors) ? error.errors[0] : null) ??
          fallbackMessage;
      } else {
        const text = await response.text();
        if (text) {
          message = text.length > 240 ? `${text.slice(0, 240)}…` : text;
        }
      }
    } catch {
      message = `${fallbackMessage} (código HTTP ${response.status})`;
    }

    if (response.status === 401) {
      const unauthorized = new Error(message);
      unauthorized.status = 401;
      throw unauthorized;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function request(url, options = {}, fallbackMessage = 'Error en la solicitud.') {
  try {
    const response = await fetch(url, options);
    return parseResponse(response, fallbackMessage);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con el servidor. Comprueba que el backend esté en ejecución (puerto 8080).'
      );
    }
    throw error;
  }
}

export function get(url, fallbackMessage) {
  return request(url, {}, fallbackMessage);
}

export function post(url, body, fallbackMessage, headers = {}) {
  return request(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body)
    },
    fallbackMessage
  );
}

export function put(url, body, fallbackMessage, headers = {}) {
  return request(
    url,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body)
    },
    fallbackMessage
  );
}

export function patch(url, body, fallbackMessage, headers = {}) {
  return request(
    url,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body)
    },
    fallbackMessage
  );
}

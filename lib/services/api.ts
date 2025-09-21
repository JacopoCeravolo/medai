interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
}

const fetchData = async (
  url: string,
  options: FetchOptions = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const token = localStorage.getItem('token');
  
  const defaultOptions: FetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const api = {
  get: (url: string, options?: FetchOptions) =>
    fetchData(url, { ...options, method: 'GET' }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: (url: string, body: any, options?: FetchOptions) =>
    fetchData(url, { ...options, method: 'POST', body }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: (url: string, body: any, options?: FetchOptions) =>
    fetchData(url, { ...options, method: 'PUT', body }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: (url: string, body?: any, options?: FetchOptions) =>
    fetchData(url, { ...options, method: 'DELETE', body }),
};

interface FetchOptions extends RequestInit {
  body?: any;
}

const fetchData = async (
  url: string,
  options: FetchOptions = {}
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
  post: (url: string, body: any, options?: FetchOptions) =>
    fetchData(url, { ...options, method: 'POST', body }),
  put: (url: string, body: any, options?: FetchOptions) =>
    fetchData(url, { ...options, method: 'PUT', body }),
  delete: (url: string, body?: any, options?: FetchOptions) =>
    fetchData(url, { ...options, method: 'DELETE', body }),
};

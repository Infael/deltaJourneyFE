export interface FetchOptions extends RequestInit {
  url: string;
  params?: Record<string, string | number | boolean>;
  data?: string | FormData | Blob | ArrayBuffer | ArrayBufferView;
}

export const fetchClient = async <T>(
  { url, params, data, ...options }: FetchOptions,
  customOptions?: RequestInit,
): Promise<T> => {
  // Get saved access token from session storage
  const accessToken = sessionStorage.getItem("access_token");
  // check expiration time
  const expiration = sessionStorage.getItem("expiration");
  const isExpired = expiration ? Date.now() > Number(expiration) : true;
  if (!accessToken || isExpired) {
    sessionStorage.clear();
    return Promise.reject(new Error("Access token is missing or expired"));
  }

  // If the params exist, we add them to the URL query string
  const queryString = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";

  const response = await fetch(url + queryString, {
    ...options,
    ...customOptions,
    headers: {
      ...options.headers,
      ...customOptions?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ?? undefined, // Orval generates code with data instead of body, so if data is present, we use it as the body
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

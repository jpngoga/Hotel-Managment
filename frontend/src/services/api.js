
const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem("hotel_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token && {
        Authorization: `Token ${token}`,
      }),
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.detail ||
      (typeof data === "object" && data !== null
        ? Object.entries(data)
            .map(([field, errors]) =>
              `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`
            )
            .join(" | ")
        : "Something went wrong with the API request.");

    throw new Error(message);
  }

  return data;
}

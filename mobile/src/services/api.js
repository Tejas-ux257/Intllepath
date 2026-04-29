function getApiUrl() {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:5000`;
  }

  return "http://localhost:5000";
}

export async function api(path, options = {}) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

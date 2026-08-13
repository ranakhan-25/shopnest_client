import { useAuthStore } from "@/components/store/authStore";


export async function apiFetch(url: string, options: RequestInit = {}) {
  const { accessToken, setAccessToken, logout } = useAuthStore.getState();

  const doFetch = (token: string | null) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let res = await doFetch(accessToken);

  if (res.status === 401) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
      { method: "POST", credentials: "include" }
    );

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessToken(data.accessToken);
      res = await doFetch(data.accessToken);
    } else {
      logout();
      window.location.href = "/auth/signin";
      throw new Error("Session expired, please sign in again");
    }
  }

  return res;
}
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.1.2:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to add access token to requests
api.interceptors.request.use(async (config) => {
  const isAuthRoute =
    config.url?.includes("/login") ||
    config.url?.includes("/register") ||
    config.url?.includes("/api/champions");
  if (!isAuthRoute) {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Interceptor to handle 403 (Token Expired) by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const response = await api.post("/refresh", { refreshToken });
        const { accessToken } = response.data;
        await SecureStore.setItemAsync("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const register = (credentials) =>
  api.post("api/auth/register", credentials);
export const login = (credentials) => api.post("api/auth/login", credentials);
export const refresh = (refreshToken) =>
  api.get("api/auth/refresh", { refreshToken });
export const logout = (refreshToken) =>
  api.post("api/auth/logout", { refreshToken });
export const meAuth = (user) => api.get("api/auth/me", user);

export const getChampions = () => api.get("api/champions");

export const getChampion = async (id) => {
  const backendResponse = await api.get(`api/champions/${id}`);
  const backendData = backendResponse.data;


  const spells = backendData.abilities
    .filter((ability) => ability.key !== "P")
    .map((ability) => ({
      id: ability.id,
      key: ability.key,
      name: ability.name,
      description: ability.tooltipTemplate, // Fallback for non-interactive
      tooltip: ability.tooltipTemplate, // For parsing
      cooldown: ability.cooldowns,
      cost: ability.costs,
      range: ability.ranges,
      damageComponents: ability.damageComponents,
      vars: ability.vars || [],
    }));

  const passive = backendData.abilities
    .filter((ability) => ability.key === "P")
    .map((ability) => ({
      name: ability.name,
      description: ability.tooltipTemplate,
      tooltip: ability.tooltipTemplate, // For parsing
      vars: ability.vars || [],
      damageComponents: ability.damageComponents || [], // For parsing
    }))[0] || { name: "", description: "", tooltip: "" };

  return {
    id: backendData.id,
    key: backendData.id, // Adjust if Data Dragon key is needed
    name: backendData.name,
    // partype: "Mana", // From Data Dragon
    spells,
    passive,
  };
};

export default api;

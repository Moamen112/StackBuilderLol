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

/**
 * {
    "id": "Annie",
    "name": "Annie",
    "patchVersion": "15.18.1",
    "lastUpdated": "2025-09-16T04:05:27.209Z",
    "abilities": [
        {
            "id": "AnnieP",
            "championId": "Annie",
            "key": "P",
            "name": "Pyromania",
            "tooltipTemplate": "After 4 spells, next offensive spell stuns for {{ e1 }} seconds.",
            "cooldowns": [
                0
            ],
            "costs": [
                0
            ],
            "ranges": [
                0
            ],
            "damageComponents": [
                {
                    "id": "309a694c-30ce-45a1-a593-2c351d5c2b03",
                    "abilityId": "AnnieP",
                    "componentKey": "e1",
                    "baseValues": [
                        1.75
                    ],
                    "apScaling": [
                        0
                    ],
                    "adScaling": [
                        0
                    ],
                    "bonusAdScaling": [
                        0
                    ],
                    "healthScaling": [
                        0
                    ],
                    "otherScalings": [],
                    "valueType": "Damage",
                    "damageType": null
                }
            ]
        },
        {
            "id": "AnnieQ",
            "championId": "Annie",
            "key": "Q",
            "name": "Disintegrate",
            "tooltipTemplate": "Deals {{ e1 }} plus {{ a1 }} AP magic damage.",
            "cooldowns": [
                4,
                4,
                4,
                4,
                4
            ],
            "costs": [
                60,
                65,
                70,
                75,
                80
            ],
            "ranges": [
                625,
                625,
                625,
                625,
                625
            ],
            "damageComponents": [
                {
                    "id": "ac05ed59-e45c-4d14-b2e4-caaae91880c0",
                    "abilityId": "AnnieQ",
                    "componentKey": "e1",
                    "baseValues": [
                        80,
                        115,
                        150,
                        185,
                        220
                    ],
                    "apScaling": [
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8
                    ],
                    "adScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "bonusAdScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "healthScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "otherScalings": [],
                    "valueType": "Damage",
                    "damageType": "Magic"
                }
            ]
        },
        {
            "id": "AnnieW",
            "championId": "Annie",
            "key": "W",
            "name": "Incinerate",
            "tooltipTemplate": "Deals {{ e1 }} plus {{ a1 }} AP magic damage.",
            "cooldowns": [
                8,
                8,
                8,
                8,
                8
            ],
            "costs": [
                70,
                80,
                90,
                100,
                110
            ],
            "ranges": [
                600,
                600,
                600,
                600,
                600
            ],
            "damageComponents": [
                {
                    "id": "9fbb8809-5d0d-488b-9640-1f941a2b735c",
                    "abilityId": "AnnieW",
                    "componentKey": "e1",
                    "baseValues": [
                        70,
                        115,
                        160,
                        205,
                        250
                    ],
                    "apScaling": [
                        0.85,
                        0.85,
                        0.85,
                        0.85,
                        0.85
                    ],
                    "adScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "bonusAdScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "healthScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "otherScalings": [],
                    "valueType": "Damage",
                    "damageType": "Magic"
                }
            ]
        },
        {
            "id": "AnnieE",
            "championId": "Annie",
            "key": "E",
            "name": "Molten Shield",
            "tooltipTemplate": "Shields for {{ e1 }} plus {{ a1 }} AP. Deals {{ e2 }} plus {{ a2 }} AP magic damage.",
            "cooldowns": [
                14,
                13,
                12,
                11,
                10
            ],
            "costs": [
                40,
                40,
                40,
                40,
                40
            ],
            "ranges": [
                0
            ],
            "damageComponents": [
                {
                    "id": "516785e9-52b8-452d-b423-6d6b9dffa396",
                    "abilityId": "AnnieE",
                    "componentKey": "e1",
                    "baseValues": [
                        40,
                        90,
                        140,
                        190,
                        240
                    ],
                    "apScaling": [
                        0.4,
                        0.4,
                        0.4,
                        0.4,
                        0.4
                    ],
                    "adScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "bonusAdScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "healthScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "otherScalings": [],
                    "valueType": "Shield",
                    "damageType": null
                },
                {
                    "id": "a6f1d101-0722-42cb-9d72-bbf515860f93",
                    "abilityId": "AnnieE",
                    "componentKey": "e2",
                    "baseValues": [
                        30,
                        50,
                        70,
                        90,
                        110
                    ],
                    "apScaling": [
                        0.2,
                        0.2,
                        0.2,
                        0.2,
                        0.2
                    ],
                    "adScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "bonusAdScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "healthScaling": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "otherScalings": [],
                    "valueType": "Damage",
                    "damageType": "Magic"
                }
            ]
        },
        {
            "id": "AnnieR",
            "championId": "Annie",
            "key": "R",
            "name": "Summon: Tibbers",
            "tooltipTemplate": "Deals {{ e1 }} plus {{ a1 }} AP magic damage on cast.",
            "cooldowns": [
                120,
                100,
                80
            ],
            "costs": [
                100,
                100,
                100
            ],
            "ranges": [
                600,
                600,
                600
            ],
            "damageComponents": [
                {
                    "id": "abd875dd-7e98-439a-b7c1-1b23f384d6f5",
                    "abilityId": "AnnieR",
                    "componentKey": "e1",
                    "baseValues": [
                        150,
                        275,
                        400
                    ],
                    "apScaling": [
                        0.75,
                        0.75,
                        0.75
                    ],
                    "adScaling": [
                        0,
                        0,
                        0
                    ],
                    "bonusAdScaling": [
                        0,
                        0,
                        0
                    ],
                    "healthScaling": [
                        0,
                        0,
                        0
                    ],
                    "otherScalings": [],
                    "valueType": "Damage",
                    "damageType": "Magic"
                }
            ]
        }
    ]
}
 */

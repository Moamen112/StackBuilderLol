export const champions = [
  {
    id: 1,
    name: "Aatrox",
    class: "Fighter",
    difficulty: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg",
  },
  {
    id: 2,
    name: "Ahri",
    class: "Mage",
    difficulty: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ahri_0.jpg",
  },
  {
    id: 3,
    name: "Akali",
    class: "Assassin",
    difficulty: "Hard",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Akali_0.jpg",
  },
  {
    id: 4,
    name: "Alistar",
    class: "Tank",
    difficulty: "Easy",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Alistar_0.jpg",
  },
  {
    id: 5,
    name: "Amumu",
    class: "Tank",
    difficulty: "Easy",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Amumu_0.jpg",
  },
  {
    id: 6,
    name: "Anivia",
    class: "Mage",
    difficulty: "Hard",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Anivia_0.jpg",
  },
  {
    id: 7,
    name: "Annie",
    class: "Mage",
    difficulty: "Easy",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Annie_0.jpg",
  },
  {
    id: 8,
    name: "Ashe",
    class: "Marksman",
    difficulty: "Easy",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ashe_0.jpg",
  },
  {
    id: 9,
    name: "Azir",
    class: "Mage",
    difficulty: "Hard",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Azir_0.jpg",
  },
  {
    id: 10,
    name: "Bard",
    class: "Support",
    difficulty: "Hard",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Bard_0.jpg",
  },
];

import axios from "axios";

const apiBaseUrl = "https://ddragon.leagueoflegends.com/cdn/15.18.1/data/en_US";
const imageBaseUrl = "https://ddragon.leagueoflegends.com/cdn";

//Champions Endpoint
const allChampionEndPoint = `${apiBaseUrl}/champion.json`;
const championEndpoint = (id) => `${apiBaseUrl}/champion/${id}.json`;

//Items Endpoint
const allItemsEndPoint = `${apiBaseUrl}/item.json`;

//Champion images APIs
export const championImage = (champ) =>
  `${imageBaseUrl}/img/champion/loading/${champ}_0.jpg`;
export const championImageSplash = (champ) =>
  `${imageBaseUrl}/img/champion/splash/${champ}_0.jpg`;
export const championSkillImage = (skill) =>
  `${imageBaseUrl}/15.17.1/img/spell/${skill}.png`;
export const championPassiveImage = (passive) =>
  `${imageBaseUrl}/15.17.1/img/passive/${passive}`;
export const championSkinImage = (champId, skinId) =>
  `${imageBaseUrl}/img/champion/splash
/${champId}_${skinId}.jpg`;

//Spell Video API
export const spellVideo = (champId, skillOrder) =>
  `https://lol.dyn.riotcdn.net/x/videos/champion-abilities/${champId >= 100 ? `0${champId}` : `00${champId}`}/ability_${champId >= 100 ? `0${champId}` : `00${champId}`}_${skillOrder}1.mp4`;

//Item Image Api
export const itemImage = (itemId) =>
  `${imageBaseUrl}/15.17.1/img/item/${itemId}.png`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
    headers: {
      accept: "application/json",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log("error: ", err);
    return {};
  }
};

export const fetchAllChampions = () => {
  return apiCall(allChampionEndPoint);
};

export const fetchChampionDetails = (id) => {
  return apiCall(championEndpoint(id));
};

//Fetch Items
export const fetchItems = () => {
  return apiCall(allItemsEndPoint);
};

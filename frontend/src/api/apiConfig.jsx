// src/api/apiConfig.js

export const BASE_URL = 'http://localhost:5000/api'; // or your deployed server URL

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/user/login`,
  LOGOUT: `${BASE_URL}/user/logout`,
  REGISTER: `${BASE_URL}/user/register`,
  BLOG_LIST: `${BASE_URL}/blog/list`,
  BLOG_BY_ID: (id) => `${BASE_URL}/blog/${id}`,
  DELETE_BLOG:`${BASE_URL}/blog/delete`,
  UPDATE_BLOG:`${BASE_URL}/blog/update`,
  CREATE_BLOG:`${BASE_URL}/blog/create`,
  SEARCH_KEYWORD: (keyword) =>`${BASE_URL}/blog/search?keyword=${keyword}`
  // Add more as needed
};

export default API_ENDPOINTS;

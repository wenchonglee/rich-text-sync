import axios from "axios";

export const Axios = axios.create({
  baseURL: import.meta.env.PROD ? "/" : "http://localhost:3000/api/",
  // baseURL: "http://localhost:3000/api/",
});

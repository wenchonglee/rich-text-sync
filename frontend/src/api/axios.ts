import axios from "axios";

export const Axios = axios.create({
  baseURL: import.meta.env.PROD ? `${location.origin}/api/` : "http://localhost:3000/api/",
});

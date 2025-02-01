import axios from "axios";
import { API_BASE_URL } from "./constant";

const appInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default appInstance;

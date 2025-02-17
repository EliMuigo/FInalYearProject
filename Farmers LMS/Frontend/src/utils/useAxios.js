import axios from "axios";
import { getRefreshedToken, isAccessTokenExpired, setAuthUser } from "./auth";
import { API_BASE_URL } from "./constant";
import Cookies from "js-cookie";

const UseAxios = () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!isAccessTokenExpired) {
      return req;
    }

    const response = await getRefreshedToken(refreshToken);
    setAuthUser(response.access, response.refresh);
    req.headers["Authorization"] = `Bearer ${response.data?.access}`;
    return req;
  });
  return axiosInstance;
};

export default UseAxios;

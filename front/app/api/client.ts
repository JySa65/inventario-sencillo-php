import axios from "axios";
import { normalizeCreateItemError } from "./error-normalizer";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  // withCredentials: true, // si usas cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (!response) {
      // error de red, CORS, timeout, etc.
      return Promise.reject({ message: "Network or CORS error" });
    }

    if (!response.data) {
      // respuesta sin body
      return Promise.reject({
        message: `HTTP ${response.status} - ${response.statusText}`,
      });
    }

    return Promise.reject(normalizeCreateItemError(error));
  }
);

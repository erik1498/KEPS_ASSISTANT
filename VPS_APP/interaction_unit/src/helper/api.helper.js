import axios from 'axios';
import { eraseCookie, getCookie, setCookie } from './cookies.helper';
import { apiLogin } from '../service/endPointList.api';

export const axiosJWT = axios.create()

const apiUrl = import.meta.env.VITE_API_URL;

axiosJWT.interceptors.request.use(async (config) => {
  const currentDate = new Date()
  if (getCookie("tokenExpired") && getCookie("refreshToken") != null) {
    if (currentDate.getTime() >= parseFloat(getCookie("tokenExpired")) * 1000) {
      const response = await axios.post(
        apiUrl + "/user/refresh",
        {
          refreshToken: getCookie("refreshToken")
        }
      ).catch(e => {
        if (e.response.status == 401) {
          eraseCookie("token")
          eraseCookie("refreshToken")
          eraseCookie("tokenExpired")
          eraseCookie("loadedKodeAkun")
          eraseCookie("perusahaan")
          eraseCookie("role")
          eraseCookie("name")
          setCookie("login", "false")
          document.location.href = "/"
        }
      })
      config.headers.Authorization = `Bearer ${response.data.token}`
      setCookie("token", response.data.token)
      setCookie("refreshToken", response.data.refreshToken)
      setCookie("tokenExpired", response.data.tokenExpired)
      setCookie("login", "true")
      setCookie("perusahaan", response.data.perusahaan, 1)
      setCookie("role", response.data.role, 1)
      setCookie("name", response.data.name, 1)
    } else {
      config.headers.Authorization = `Bearer ${getCookie("token")}`
    }
  } else {
    if (config.url != apiLogin.getUrlCRUD()) {
      eraseCookie("token")
      eraseCookie("refreshToken")
      eraseCookie("tokenExpired")
      eraseCookie("loadedKodeAkun")
      if (!getCookie("login") && getCookie("login") == "true") {
        setCookie("login", "false")
        document.location.href = "/"
      }
    }
  }

  return Promise.resolve(config)
}, (error) => {
  return Promise.reject(error)
})

export const configMethod = (method, url, headers = {}, others = {}) => {
  return axiosJWT({
    method,
    url,
    headers: { ...headers },
    withCredentials: false,
    ...others,
  });
};

export const get = (url, others = {}, headers = {}) =>
  configMethod('GET', url, headers, others);

export const post = (url, payload, others = {}, headers = {}) => {
  return configMethod('POST', url, headers, { data: payload, ...others });
};

export const put = (url, payload, others = {}, headers = {}) =>
  configMethod('PUT', url, headers, { data: payload, ...others });

export const del = (url, others = {}, headers = {}) =>
  configMethod('DELETE', url, headers, others);

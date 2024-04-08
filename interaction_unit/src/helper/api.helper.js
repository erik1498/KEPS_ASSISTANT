import axios from 'axios';
import { eraseCookie, getCookie, setCookie } from './cookies.helper';

export const axiosJWT = axios.create()

axiosJWT.interceptors.request.use(async (config) => {
  const currentDate = new Date()
  if (getCookie("tokenExpired")) {
    if (currentDate.getTime() >= parseFloat(getCookie("tokenExpired")) * 1000) {
      const response = await axios.post(
        import.meta.env.VITE_BASE_API_KEPS_ASSISTANT_MANAGEMENT + "/user/refresh",
        {
          refreshToken: getCookie("refreshToken")
        }, {
          headers:{
            Authorization: `Bearer ${getCookie("token")}`
          }
        }
      )
      config.headers.Authorization = `Bearer ${response.data.token}`
      setCookie("token", response.data.token)
      setCookie("refreshToken", response.data.refreshToken)
      setCookie("tokenExpired", response.data.tokenExpired)
      setCookie("login", "true")
    } else {
      config.headers.Authorization = `Bearer ${getCookie("token")}`
    }
  } else {
    eraseCookie("token")
    eraseCookie("refreshToken")
    eraseCookie("tokenExpired")
    if (!getCookie("login") && getCookie("login") == "true") {
      setCookie("login", "false")
      document.location.href = "/"
    }
  }

  return config
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

import { ACCESS_TOKEN, API_BASE_URL } from "../config";

type HttpMethod = "GET" | "POST";

interface Options {
  url: string;
  method: HttpMethod;
  body?: string;
}

const request = (options: Options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN),
    );
  }

  return fetch(options.url, { headers: headers, ...options }).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    }),
  );
};

interface LoginRequest {
  login: string;
  password: string;
}

export function login(loginRequest: LoginRequest) {
  const options = {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
    body: JSON.stringify(loginRequest),
  };

  return fetch(API_BASE_URL + "/auth/signin", options).then((response) => {
    return response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    });
  });
}

interface SignupRequest {}

export function signup(signupRequest: SignupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function checkUsernameAvailability(username: string) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET",
  });
}

export function checkEmailAvailability(email: string) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET",
  });
}

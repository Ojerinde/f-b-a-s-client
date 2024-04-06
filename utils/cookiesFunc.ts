// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from "js-cookie"

// Function to store a token in a cookie
export const setItemToCookie = (key: string, value: string) => {
  Cookies.set(key, value)
}

// Function to retrieve a token from the cookie
export const getItemFromCookie = (key: string) => {
  return Cookies.get(key) || null
}

// Function to remove the token cookie
export const removeItemFromCookie = (key: string) => {
  Cookies.remove(key)
}

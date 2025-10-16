const BASE_URL = "http://127.0.0.1:8000";

export const API_ROUTES = {
  LOGIN: `${BASE_URL}/users/users/login`,
  REGISTER: `${BASE_URL}/users/users/create`,
  GET_USERS: `${BASE_URL}/users/users/all`,
  GET_USER: (id: string) => `${BASE_URL}/users/users/get/${id}`,
  UPDATE_USER: (id: string) => `${BASE_URL}/users/users/update/${id}`,
  DELETE_USER: (id: string) => `${BASE_URL}/users/users/delete/${id}`,
  LOGOUT: `${BASE_URL}/users/users/logout`,
  RESET_PASSWORD: `${BASE_URL}/users/users/reset-password`,

  CREATE_PRODUCT: `${BASE_URL}/products/products/create`,
  GET_ALL_PRODUCTS: `${BASE_URL}/products/products/all`,
  GET_PRODUCT: (id: string) => `${BASE_URL}/products/products/get/${id}`,
  GET_PRODUCT_IMAGE: (id: string) => `${BASE_URL}/products/products/image/${id}`,
  UPDATE_PRODUCT: (id: string) => `${BASE_URL}/products/products/update/${id}`,
  DELETE_PRODUCT: (id: string) => `${BASE_URL}/products/products/delete/${id}`,

  GET_CART_ITEMS: `${BASE_URL}/cart/cart/user`,
  ADD_TO_CART: `${BASE_URL}/cart/cart/add`,
  UPDATE_CART_ITEM: (cartId: string) => `${BASE_URL}/cart/cart/${cartId}/quantity`,
  DELETE_CART_ITEM: (cartId: string) => `${BASE_URL}/cart/cart/${cartId}`,

  CHECKOUT: `${BASE_URL}/orders/orders/checkout`,
  GET_USER_ORDERS: `${BASE_URL}/orders/orders/user`,
  GET_ALL_ORDERS: `${BASE_URL}/orders/orders/admin/all`,
};

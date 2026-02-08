import axios from "./api";

export const placeOrder = (data) =>
  axios.post("/orders", data);

export const myOrders = () =>
  axios.get("/orders/my");

export const allOrders = () =>
  axios.get("/orders");

export const updateOrderStatus = (id, status) =>
  axios.put(`/orders/${id}`, { status });

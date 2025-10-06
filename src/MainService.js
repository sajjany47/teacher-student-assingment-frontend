import axios from "axios";
import { BASE_URL, getHeaders } from "../utilis";

export const UserLogin = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

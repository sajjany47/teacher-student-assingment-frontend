export const BASE_URL = "http://localhost:8088";

export const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};
export const getHeadersWithToken = () => {
  const token = localStorage.getItem("token"); // or whatever key you used
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

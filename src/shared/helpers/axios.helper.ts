import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const sendRequestPost = async (
  apiUrl: string,
  postData: any,
  headers: AxiosRequestConfig
) => {
  try {
    const response: AxiosResponse = await axios.post(apiUrl, postData, headers);
    return response.data;
  } catch (error) {
    console.error((error as any).message);
  }
};

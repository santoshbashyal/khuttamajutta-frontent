import axios from "axios";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export const axiosMethod = async ({ url, data, method, purpose }) => {
  return new Promise(async (resolve, reject) => {
    await axios[method](url, { ...data }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        if (res?.data?.id) {
          toast.success(purpose);
          resolve(true);
        }
        if (res?.data == "") {
          toast.success(purpose);
          resolve(true);
        }
      })
      .catch((err) => {
        if (err.response?.data?.detail) {
          if (err.response?.data?.detail[0]?.msg) {
            toast?.error(err.response?.data?.detail[0]?.msg);
          } else toast?.error(err.response?.data?.detail);
        } else toast?.error(err.message);
        reject(false);
      });
  });
};

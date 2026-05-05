import axiosInstance from "./axiosInstance";

export const invoiceAPI = {
  getByOrderId: (orderId: string) => axiosInstance.get(`/api/v1/invoice/order/${orderId}`),
  getQr: (invoiceId: string) => axiosInstance.get(`/api/v1/invoice/${invoiceId}/qr`),
  downloadPdf: (invoiceId: string) => axiosInstance.get(`/api/v1/invoice/${invoiceId}/pdf`, { responseType: "blob" }),
};
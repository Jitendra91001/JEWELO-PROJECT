import axiosInstance from "./axiosInstance";

export interface PaymentPayload {
  invoiceId: string;
  amount: number;
  method: "UPI" | "CARD" | "NETBANKING" | "CASH";
  transactionId?: string;
}

export const paymentAPI = {
  create: (data: PaymentPayload) => axiosInstance.post("/api/v1/payment", data),
};
import prisma from "../database/db";
import { NotFoundError } from "../utils/errors";

export const createPayment = async (invoiceId: string, data: any) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    throw new NotFoundError("Invoice not found");
  }

  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount: data.amount,
      method: data.method,
      transactionId: data.transactionId,
      paymentStatus: 'COMPLETED',
      paidAt: new Date(),
    },
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'PAID',
      paidAt: new Date(),
    },
  });

  await prisma.order.update({
    where: { id: invoice.orderId },
    data: {
      paymentStatus: 'COMPLETED',
      transactionId: data.transactionId,
    },
  });

  return payment;
};
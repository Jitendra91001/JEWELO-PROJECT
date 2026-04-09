import prisma from "../database/db";

export const createPayment = async (invoiceId: string, data: any) => {
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

  // ✅ Update Invoice
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'PAID',
      paidAt: new Date(),
    },
  });

  return payment;
};
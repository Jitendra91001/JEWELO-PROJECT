import { generatePaymentQR } from "./qr.service";
import { generateInvoicePDF } from "./pdf.service";
import prisma from "../database/db";

const generateInvoiceNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${random}`;
};

export const createInvoiceForOrder = async (order: any) => {
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      orderId: order.id,
      userId: order.userId,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: "ISSUED",
      issuedAt: new Date(),
    },
  });

  // ✅ Generate QR
  const qrCode = await generatePaymentQR(invoice.total);
  const user = await prisma.user.findUnique({
    where: { id: order.userId },
  });

  // ✅ Generate PDF
  await generateInvoicePDF(invoice, order, user, qrCode);

  return { invoice, qrCode };
};

export const getInvoiceByOrderId = async (orderId: string) => {
  return prisma.invoice.findUnique({
    where: { orderId },
    include: { payments: true },
  });
};

import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export const generateInvoicePDF = async (
  invoice: any,
  order: any,
  user: any,
  qrCode: string
) => {
  const templatePath = path.join(__dirname, '../views/invoice.ejs');

  // Render HTML
  const html = await ejs.renderFile(templatePath, {
    invoice,
    order,
    user,
    qrCode,
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'load' });

  const filePath = path.join(
    __dirname,
    `../invoices/${invoice.invoiceNumber}.pdf`
  );

  await page.pdf({
    path: filePath,
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  return filePath;
};
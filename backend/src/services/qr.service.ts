import QRCode from 'qrcode';
import { config } from '../config/config';

export const generatePaymentQR = async (amount: number, note?: string) => {
  const upiId = config.upiId;
  const name = config.upiName;

  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount.toFixed(2)}&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ''}`;

  return await QRCode.toDataURL(upiString);
};
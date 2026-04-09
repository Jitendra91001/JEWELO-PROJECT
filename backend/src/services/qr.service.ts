import QRCode from 'qrcode';

export const generatePaymentQR = async (amount: number) => {
  const upiId = 'yourupi@bank';
  const name = 'Jewellery Shop';

  const upiString = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

  return await QRCode.toDataURL(upiString);
};
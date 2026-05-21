import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invoiceAPI } from "@/api/invoice.api";
import { paymentAPI } from "@/api/payment.api";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { toast } from "sonner";
import { CheckCircle, Copy, ArrowLeft, Download, Printer } from "lucide-react";

const UPI_ID = "jy34104@okicici";
const UPI_PAYEE_NAME = "Jewellery Store";

interface InvoiceItem {
  id: string;
  quantity: number;
  price: number;
  discount: number;
  product?: {
    name?: string;
  };
}

interface OrderWithItems {
  id: string;
  orderNumber?: string;
  shippingAddress?: string;
  billingAddress?: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  items: InvoiceItem[];
}

interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
  issuedAt?: string;
  order?: OrderWithItems;
}

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const invoiceItems = invoice?.order?.items ?? [];
  const shippingCost = invoice?.order?.shippingCost ?? 0;
  const discountAmount = invoice?.order?.discountAmount ?? 0;
  const taxAmount = invoice?.order?.tax ?? 0;
  const generatedDate = invoice?.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : "-";

  const grandTotal = invoice?.total ?? 0;

  const handleCopyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!invoice?.id) return;
    setDownloading(true);

    try {
      const response = await invoiceAPI.downloadPdf(invoice.id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.invoiceNumber || "invoice"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Invoice PDF downloaded");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || "Failed to download invoice PDF.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const loadInvoice = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const response = await invoiceAPI.getByOrderId(orderId);
        const invoiceData = response.data?.data as InvoiceResponse;
        setInvoice(invoiceData);

        if (invoiceData?.id) {
          const qrResponse = await invoiceAPI.getQr(invoiceData.id);
          setQrCode(qrResponse.data?.qrCode || "");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(err.response?.data?.message || err.message || "Unable to load invoice details.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [orderId]);

  const handleConfirmPayment = async () => {
    if (!invoice?.id) return;
    if (!transactionId.trim()) {
      toast.error("Enter the payment transaction reference.");
      return;
    }

    setConfirming(true);
    try {
      await paymentAPI.create({
        invoiceId: invoice.id,
        amount: invoice.total,
        method: "UPI",
        transactionId: transactionId.trim(),
      });
      toast.success("Payment confirmed successfully. Redirecting to orders...");
      setInvoice({ ...invoice, status: "PAID" });
      navigate("/orders");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || "Payment confirmation failed.");
    } finally {
      setConfirming(false);
    }
  };

  const handleBackToOrders = () => {
    navigate("/orders");
  };

  const addressLines = useMemo(() => {
    const raw = invoice?.order?.shippingAddress || invoice?.order?.billingAddress || "";
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        return Object.values(parsed).filter(Boolean).join(", ");
      }
    } catch {
      return raw;
    }
    return raw;
  }, [invoice]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading invoice details…</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
        <SEOHead title="Invoice" />
        <p className="text-sm text-muted-foreground">No invoice found for this order.</p>
        <button onClick={() => navigate("/")} className="mt-4 gold-gradient text-primary-foreground px-6 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer">
          Back to shop
        </button>
      </div>
    );
  }

  const isPaid = invoice.status === "PAID";

  return (
    <>
      <SEOHead title="Invoice" />
      <style>{`@media print {
          body {
            margin: 0 !important;
            background: #fff !important;
            color: #000 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #invoice-print-area,
          #invoice-print-area * {
            visibility: visible !important;
          }
          #invoice-print-area {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
          }
          #invoice-print-area .no-print {
            display: none !important;
          }
          .bg-card,
          .bg-background,
          .bg-white {
            background: #fff !important;
          }
          .border {
            border-color: #000 !important;
          }
          .border-border,
          .bg-border {
            border-color: #000 !important;
          }
          .text-muted-foreground,
          .text-primary,
          .text-foreground {
            color: #000 !important;
          }
          .shadow-sm,
          .shadow,
          .shadow-lg {
            box-shadow: none !important;
          }
          img {
            max-width: 100% !important;
          }
        }`}</style>
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div id="invoice-print-area" className="flex-1">
            <div className="mb-6 flex flex-col gap-4 rounded-sm border border-border bg-card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Invoice</p>
                  <h1 className="font-display text-3xl font-bold text-foreground">Invoice #{invoice.invoiceNumber}</h1>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {invoice.status || "ISSUED"}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-sm border border-border p-4 bg-background">
                  <p className="text-sm font-medium text-muted-foreground">Issued On</p>
                  <p className="mt-1 text-sm text-foreground">{generatedDate}</p>
                </div>
                <div className="rounded-sm border border-border p-4 bg-background">
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="mt-1 text-sm text-foreground">{invoice.order?.id ?? "-"}</p>
                </div>
              </div>
            </div>

            <div id="invoice-print-card" className="rounded-sm border border-border bg-card p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Billed To</p>
                  <p className="mt-2 text-sm text-foreground">{addressLines || "Customer address not available"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payee</p>
                  <p className="mt-2 text-sm text-foreground">{UPI_PAYEE_NAME}</p>
                  <p className="text-sm text-muted-foreground mt-1">UPI ID: {UPI_ID}</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-sm border border-border">
                <div className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 bg-secondary/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:grid-cols-[4fr_1fr_1fr_1fr]">
                  <div>Product</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Total</div>
                </div>
                <div className="divide-y divide-border bg-background">
                  {invoiceItems.map((item) => {
                    const label = item.product?.name || "Item";
                    const itemTotal = (item.price - item.discount) * item.quantity;
                    return (
                      <div key={item.id} className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 px-4 py-4 text-sm text-foreground sm:grid-cols-[4fr_1fr_1fr_1fr]">
                        <div>{label}</div>
                        <div className="text-right">{item.quantity}</div>
                        <div className="text-right">{CURRENCY}{item.price.toFixed(2)}</div>
                        <div className="text-right">{CURRENCY}{itemTotal.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-4 rounded-sm border border-border bg-background p-4">
                  <p className="text-sm font-medium text-muted-foreground">Payment Instructions</p>
                  <p className="text-sm text-foreground">Scan the PhonePe / UPI QR code below, or copy the UPI ID to complete payment from your app.</p>
                  <div className="rounded-sm border border-border bg-white p-4 text-center">
                    {!isPaid ? (
                      <>
                        {qrCode ? (
                          <img src={qrCode} alt="PhonePe QR Code" className="mx-auto h-52 w-52 object-contain" />
                        ) : (
                          <p className="text-sm text-muted-foreground">Generating payment QR code…</p>
                        )}
                        <div className="mt-4 rounded-sm border border-border bg-card p-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">UPI ID</p>
                          <p className="mt-2 text-sm font-medium text-foreground">{UPI_ID}</p>
                          <button
                            type="button"
                            onClick={() => handleCopyText(UPI_ID)}
                            className="mt-3 inline-flex w-full items-center justify-center rounded-sm border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors no-print"
                          >
                            Copy UPI ID
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 p-4">
                        <p className="text-sm font-medium text-foreground">Payment complete.</p>
                        <p className="text-sm text-muted-foreground">The QR code is hidden because this invoice has already been paid.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3 rounded-sm border border-border bg-background p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{CURRENCY}{invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{CURRENCY}{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>{CURRENCY}{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Discount</span>
                    <span>-{CURRENCY}{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 text-base font-semibold text-foreground flex items-center justify-between">
                    <span>Total</span>
                    <span>{CURRENCY}{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="w-full max-w-md flex-none space-y-6 no-print">
            <div className="rounded-sm border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Payment</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{isPaid ? "Paid" : "Pay Now"}</h2>
                </div>
                <div className="rounded-full bg-secondary/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{invoice.status || "ISSUED"}</div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-sm border border-border bg-background p-4">
                  <p className="text-sm font-medium text-muted-foreground">Amount Due</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{CURRENCY}{grandTotal.toFixed(2)}</p>
                </div>

                {isPaid ? (
                  <div className="space-y-4 rounded-sm border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Payment is complete. Download or print the invoice for your records.</p>
                    <button onClick={handleDownloadPdf} disabled={downloading} className="gold-gradient w-full text-primary-foreground px-4 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer disabled:opacity-50 inline-flex items-center justify-center gap-2">
                      <Download size={16} /> {downloading ? "Downloading…" : "Download Invoice"}
                    </button>
                    <button onClick={handlePrintInvoice} className="border border-border bg-background px-4 py-3 rounded-sm text-sm font-semibold uppercase text-foreground hover:border-primary hover:text-primary transition-colors inline-flex items-center justify-center gap-2">
                      <Printer size={16} /> Print Invoice
                    </button>
                  </div>
                ) : (
                  <div className="rounded-sm border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Scan the QR code, complete the payment, then confirm with your transaction reference.</p>
                  </div>
                )}
              </div>
            </div>

            {!isPaid && (
              <div className="rounded-sm border border-border bg-card p-6">
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Confirm Payment</p>
                  <p className="mt-2 text-sm text-foreground">Enter the UPI transaction reference after completing payment.</p>
                </div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">Transaction Reference</label>
                <input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="UPI transaction ID"
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                  className="gold-gradient mt-4 w-full text-primary-foreground px-4 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer disabled:opacity-50"
                >
                  {confirming ? "Confirming…" : "Confirm Payment"}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
};

export default Payment;

import PDFDocument from "pdfkit";
import { Writable } from "stream";

export const generateInvoicePdf = async (order: any, outputStream: Writable): Promise<void> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    doc.pipe(outputStream);

    // Luxury Header
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("JEWELO LUXURY MAISON", { align: "center" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#8A7343")
      .text("Haute Joaillerie & Precious Gemstones", { align: "center" })
      .moveDown(1.5);

    // Divider
    doc.strokeColor("#D4AF37").lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke().moveDown(1);

    // Invoice Meta Information
    const leftCol = 40;
    const rightCol = 320;
    const infoStartY = doc.y;

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("TAX INVOICE", leftCol, infoStartY)
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text(`Invoice No: INV-${order.orderNumber}`)
      .text(`Order Ref: ${order.orderNumber}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`)
      .text(`Status: ${order.orderStatus}`)
      .text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`);

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("BILLED TO & DELIVERED TO", rightCol, infoStartY)
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text(`${order.shippingAddress?.fullName || "Valued Client"}`)
      .text(`${order.shippingAddress?.addressLine1 || ""}`)
      .text(`${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.postalCode || ""}`)
      .text(`Phone: ${order.shippingAddress?.phone || ""}`);

    doc.y = Math.max(doc.y, infoStartY + 85);
    doc.moveDown(1.5);

    // Items Table Header
    const tableTop = doc.y;
    doc
      .rect(40, tableTop, 515, 20)
      .fill("#F9F7F2")
      .strokeColor("#E5E0D8")
      .stroke();

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("ITEM & SPECIFICATIONS", 45, tableTop + 5, { width: 240 })
      .text("PURITY", 290, tableTop + 5, { width: 60 })
      .text("QTY", 355, tableTop + 5, { width: 30, align: "center" })
      .text("RATE", 390, tableTop + 5, { width: 75, align: "right" })
      .text("AMOUNT", 470, tableTop + 5, { width: 80, align: "right" });

    doc.y = tableTop + 25;

    // Item Rows
    let currentY = doc.y;
    const items = order.items || [];

    for (const item of items) {
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#222222")
        .text(item.productName || "Jewellery Piece", 45, currentY, { width: 240 });

      const specsText = [
        item.sku ? `SKU: ${item.sku}` : "",
        item.metalType ? `${item.metalType}` : "",
        item.metalWeight ? `${item.metalWeight}g` : "",
        item.diamondWeightCarat ? `Dia: ${item.diamondWeightCarat}ct` : "",
        item.selectedSize ? `Size: ${item.selectedSize}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#777777")
        .text(specsText, 45, currentY + 12, { width: 240 });

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#333333")
        .text(item.metalPurity || "18K", 290, currentY, { width: 60 })
        .text(String(item.quantity || 1), 355, currentY, { width: 30, align: "center" })
        .text(`₹${(item.unitPrice || 0).toLocaleString("en-IN")}`, 390, currentY, { width: 75, align: "right" })
        .text(`₹${(item.totalPrice || 0).toLocaleString("en-IN")}`, 470, currentY, { width: 80, align: "right" });

      currentY += 32;

      doc.strokeColor("#EFEFEF").lineWidth(0.5).moveTo(40, currentY).lineTo(555, currentY).stroke();
      currentY += 6;
    }

    doc.y = currentY + 10;

    // Financial Totals Summary
    const summaryX = 350;
    const valueX = 470;
    let summaryY = doc.y;

    const printSummaryLine = (label: string, value: string, isBold: boolean = false) => {
      doc
        .font(isBold ? "Helvetica-Bold" : "Helvetica")
        .fontSize(isBold ? 10 : 9)
        .fillColor(isBold ? "#1A1A1A" : "#555555")
        .text(label, summaryX, summaryY, { width: 110, align: "right" })
        .text(value, valueX, summaryY, { width: 80, align: "right" });
      summaryY += 16;
    };

    printSummaryLine("Subtotal:", `₹${(order.subtotal || 0).toLocaleString("en-IN")}`);
    if (order.discountAmount > 0) {
      printSummaryLine("Promotional Discount:", `-₹${order.discountAmount.toLocaleString("en-IN")}`);
    }
    printSummaryLine("GST (3%):", `₹${(order.taxAmount || 0).toLocaleString("en-IN")}`);
    printSummaryLine("Insured Shipping:", order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee.toLocaleString("en-IN")}`);

    doc.strokeColor("#D4AF37").lineWidth(0.5).moveTo(summaryX, summaryY).lineTo(555, summaryY).stroke();
    summaryY += 5;

    printSummaryLine("Grand Total:", `₹${(order.totalAmount || 0).toLocaleString("en-IN")}`, true);

    // Authenticity Declaration Footer
    doc.y = Math.max(doc.y, summaryY + 30);
    doc
      .fontSize(8)
      .font("Helvetica-Oblique")
      .fillColor("#888888")
      .text(
        "Certified BIS Hallmarked Jewellery. Each piece is crafted in accordance with Bureau of Indian Standards and certified by authorized gemological laboratories. Thank you for choosing JEWELO Luxury Maison.",
        40,
        doc.y,
        { align: "center", width: 515 }
      );

    doc.end();
    outputStream.on("finish", resolve);
    outputStream.on("error", reject);
  });
};

export const generateInvoicePDF = async (
  _invoice: any,
  _order: any,
  _user?: any,
  _qrCode?: any
): Promise<Buffer> => {
  return Buffer.from("");
};

export const generateCertificatePdf = async (product: any, outputStream: Writable): Promise<void> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    doc.pipe(outputStream);

    // Luxury Certificate Border
    doc.rect(20, 20, 555, 802).lineWidth(2).strokeColor("#D4AF37").stroke();
    doc.rect(24, 24, 547, 794).lineWidth(0.5).strokeColor("#8A7343").stroke();

    // Certificate Title
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("CERTIFICATE OF AUTHENTICITY", 0, 60, { align: "center" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#8A7343")
      .text("JEWELO HAUTE JOAILLERIE ARCHIVE", { align: "center" })
      .moveDown(2);

    doc
      .fontSize(11)
      .font("Helvetica-Oblique")
      .fillColor("#555555")
      .text(
        "This certificate guarantees that the accompanying jewellery piece has been crafted with certified precious metals and rigorously graded authentic gemstones.",
        60,
        doc.y,
        { align: "center", width: 475 }
      )
      .moveDown(2);

    // Product & Certificate Identification
    const certNumber = product.certification?.certificateNumber || `JWL-CERT-${product.sku}`;
    const leftMargin = 70;
    const valueMargin = 220;
    let currY = doc.y;

    const printCertRow = (label: string, val: string) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#1A1A1A")
        .text(label, leftMargin, currY, { width: 140 })
        .font("Helvetica")
        .fillColor("#333333")
        .text(val || "N/A", valueMargin, currY, { width: 280 });
      currY += 22;
    };

    printCertRow("Masterpiece Name:", product.name);
    printCertRow("Master SKU:", product.sku);
    printCertRow("Certificate Reference:", certNumber);
    printCertRow("Certification Agency:", product.certification?.agency || "BIS Hallmarked & In-House Laboratory");
    printCertRow("Metal Specifications:", `${product.metalType || "Gold"} (${product.metalPurity || "18K"})`);
    printCertRow("Net Metal Weight:", `${product.metalWeight || 0} grams`);

    if (product.totalDiamondWeightCarat || (product.diamondDetails && product.diamondDetails.length > 0)) {
      const diaDetail = product.diamondDetails && product.diamondDetails[0];
      const diamondInfo = [
        product.totalDiamondWeightCarat ? `Total Carat: ${product.totalDiamondWeightCarat} ct` : "",
        diaDetail ? `Cut: ${diaDetail.cut} | Color: ${diaDetail.color} | Clarity: ${diaDetail.clarity}` : "",
      ]
        .filter(Boolean)
        .join(" — ");
      printCertRow("Diamond 4Cs Grading:", diamondInfo);
    }

    if (product.gemstones && product.gemstones.length > 0) {
      const gem = product.gemstones[0];
      printCertRow("Gemstone Specifications:", `${gem.type} (${gem.weightCarat ? `${gem.weightCarat} ct` : ""})`);
    }

    printCertRow("Issue & Archive Date:", new Date().toLocaleDateString("en-IN"));

    // Signature Block
    currY += 40;
    doc.strokeColor("#D4AF37").lineWidth(0.5).moveTo(350, currY).lineTo(500, currY).stroke();
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("Chief Gemologist", 350, currY + 5, { width: 150, align: "center" })
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#777777")
      .text("JEWELO Quality Verification Board", 350, currY + 18, { width: 150, align: "center" });

    doc.end();
    outputStream.on("finish", resolve);
    outputStream.on("error", reject);
  });
};
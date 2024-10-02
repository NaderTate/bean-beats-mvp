import React from "react";
import jsPDF from "jspdf";
import Button from "@/components/button";
import { MdOutlineFileDownload } from "react-icons/md";
import { useTranslations } from "next-intl";

type Props = {
  data: {
    shopName: string;
    timeInterval?: string | null;
    shopCountry?: string | null;
    phoneNumber?: string | null;
    shopCity?: string | null;
    songPrice?: number;
    totalSongsSold: number;
    totalRevenue: number;
    receiptId: number;
  };
};

const PrintReceipt: React.FC<Props> = ({ data }) => {
  const t = useTranslations();

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set font
    doc.setFont("helvetica", "normal");

    // Add logo
    doc.addImage("/images/logo-title.png", "PNG", 75, 20, 60, 30);

    // Add receipt ID
    doc.setFontSize(12);
    doc.text(`Receipt ID : #${data.receiptId}`, 105, 60, { align: "center" });

    // Add store information with bold labels and correct spacing
    const startY = 70;
    const lineHeight = 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Store :", 20, startY);
    doc.text("Location :", 20, startY + lineHeight);
    doc.text("Phone :", 20, startY + 2 * lineHeight);
    doc.text("Period :", 20, startY + 3 * lineHeight);

    doc.setFont("helvetica", "normal");
    doc.text(`${data.shopName || "-"}`, 50, startY);
    doc.text(
      `${data.shopCity ? data.shopCity + "," : "-"} ${data.shopCountry || ""}`,
      50,
      startY + lineHeight
    );
    doc.text(`${data.phoneNumber || "-"}`, 50, startY + 2 * lineHeight);
    doc.text(`${data.timeInterval || "-"}`, 50, startY + 3 * lineHeight);

    // Add summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Summary", 20, startY + 5 * lineHeight);

    // Add grey background to summary table with added bottom padding
    doc.setFillColor(240, 240, 240);
    doc.rect(20, startY + 6 * lineHeight, 170, 45, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Total Sold Songs", 25, startY + 7 * lineHeight);
    doc.text(data.totalSongsSold.toString(), 165, startY + 7 * lineHeight, {
      align: "right",
    });

    doc.setDrawColor(200);
    doc.line(20, startY + 8 * lineHeight, 190, startY + 8 * lineHeight);

    doc.text("Song Price", 25, startY + 9 * lineHeight);
    doc.text(`${data.songPrice || "-"} $`, 165, startY + 9 * lineHeight, {
      align: "right",
    });

    doc.line(20, startY + 10 * lineHeight, 190, startY + 10 * lineHeight);

    doc.setFont("helvetica", "bold");
    doc.text("Total Revenue", 25, startY + 11 * lineHeight);
    doc.text(
      `${data.totalRevenue.toFixed(2)} $`,
      165,
      startY + 11 * lineHeight,
      { align: "right" }
    );

    // Save the PDF
    doc.save("bean_beats_receipt.pdf");
  };

  return (
    <Button
      onClick={generatePDF}
      className="h-fit mb-0 m-auto"
      endIcon={<MdOutlineFileDownload className="ms-2" />}
    >
      {t("Export")}
    </Button>
  );
};

export default PrintReceipt;

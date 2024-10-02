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

    // Add logo (simplified version)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("BeanBeats", 105, 30, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("COMPANY", 105, 36, { align: "center" });

    // Add receipt ID
    doc.text(`Receipt ID : #${data.receiptId}`, 105, 50, { align: "center" });

    // Add store information with bold labels and reduced spacing
    doc.setFont("helvetica", "bold");
    doc.text("Store :", 20, 70);
    doc.text("Location :", 20, 77);
    doc.text("Phone :", 20, 84);
    doc.text("Period :", 20, 91);

    doc.setFont("helvetica", "normal");
    doc.text(`${data.shopName}`, 40, 70);
    doc.text(`${data.shopCity}, ${data.shopCountry}`, 40, 77);
    doc.text(`${data.phoneNumber}`, 40, 84);
    doc.text(`${data.timeInterval}`, 40, 91);

    // Add summary
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, 105);

    // Add grey background to summary table with added bottom padding
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 110, 170, 45, "F");

    doc.setFont("helvetica", "normal");
    doc.text("Total Sold Songs", 25, 120);
    doc.text(data.totalSongsSold.toString(), 165, 120, { align: "right" });

    doc.setDrawColor(200);
    doc.line(20, 125, 190, 125);

    doc.text("Song Price", 25, 135);
    doc.text(`${data.songPrice} $`, 165, 135, { align: "right" });

    doc.line(20, 140, 190, 140);

    doc.setFont("helvetica", "bold");
    doc.text("Total Revenue", 25, 150);
    doc.text(`${data.totalRevenue.toFixed(2)} $`, 165, 150, { align: "right" });

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

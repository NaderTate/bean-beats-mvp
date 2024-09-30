"use client";

import React from "react";
import jsPDF from "jspdf";
import { useTranslations } from "next-intl";

import Button from "@/components/button";

import { MdOutlineFileDownload } from "react-icons/md";

type timeInterval =
  | "last7days"
  | "last30days"
  | "last3months"
  | "last6months"
  | "lastYear";

type Props = {
  data: {
    shopName: string;
    shopLogo?: string | null;
    timeInterval: timeInterval;
    shopCountry?: string | null;
    shopCity?: string | null;
    totalSongsSold: number;
    totalRevenue: number;
  };
};

const PrintReceipt: React.FC<Props> = ({ data }) => {
  const t = useTranslations();

  const getTimeIntervalText = (interval: timeInterval): string => {
    switch (interval) {
      case "last7days":
        return "Last 7 Days";
      case "last30days":
        return "Last 30 Days";
      case "last3months":
        return "Last 3 Months";
      case "last6months":
        return "Last 6 Months";
      case "lastYear":
        return "Last Year";
      default:
        return "Custom Period";
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set font
    doc.setFont("helvetica", "bold");

    // Add shop logo
    // Note: This is a placeholder. You'll need to implement image loading properly.
    data.shopLogo && doc.addImage(data.shopLogo, "PNG", 10, 10, 50, 50);

    // Add shop name
    doc.setFontSize(22);
    doc.text(data.shopName, 70, 30);

    // Add location
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const location = [data.shopCity, data.shopCountry]
      .filter(Boolean)
      .join(", ");
    if (location) {
      doc.text(`Location: ${location}`, 70, 40);
    }

    // Add time interval
    const timeIntervalText = getTimeIntervalText(data.timeInterval);
    doc.text(`Period: ${timeIntervalText}`, 10, 70);

    // Add sales information
    doc.setFontSize(14);
    doc.text(`Total Songs Sold: ${data.totalSongsSold}`, 10, 90);
    doc.text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`, 10, 100);

    // Save the PDF
    doc.save("sales_receipt.pdf");
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

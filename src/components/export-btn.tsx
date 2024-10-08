"use client";

import { CSVLink } from "react-csv";
import { Data } from "react-csv/lib/core";

import { TbFileExport } from "react-icons/tb";
import Button from "./button";
import { useTranslations } from "next-intl";

interface ExportBtnProps {
  csvData: Data;
  filename?: string;
}

const ExportBtn = ({ csvData, filename }: ExportBtnProps) => {
  const t = useTranslations();

  return (
    <CSVLink data={csvData} filename={filename ?? "data.csv"}>
      <Button
        startIcon={<TbFileExport size={20} />}
        className="text-lightblue font-medium"
        radius="full"
      >
        {t("Export")}
      </Button>
    </CSVLink>
  );
};

export default ExportBtn;

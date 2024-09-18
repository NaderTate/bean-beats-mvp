"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

type Props = {
  label: string;
  height?: height;
};

const NotFound = ({ label, height }: Props) => {
  const t = useTranslations();

  const heightMap = {
    sm: "h-32",
    md: "h-64",
    lg: "h-96",
    screen: "h-screen",
  };

  const heightClass = height ? heightMap[height] : "h-[80vh]";

  return (
    <div className={`${heightClass} flex flex-col items-center justify-center`}>
      <Image
        width={200}
        height={200}
        alt="not-found"
        src="/images/not-found.svg"
      />
      <h1>{t(label)}</h1>
    </div>
  );
};

export default NotFound;

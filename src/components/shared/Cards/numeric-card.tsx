"use client";
import React from "react";
import { AiOutlineStock } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type Item = {
  title: string;
  value?: string;
  Icon?: React.FC;
  percent?: string;
};

export default function NCard({
  item,
  selected,
  cb,
}: {
  item: Item;
  selected?: boolean;
  cb?: () => void;
}) {
  const t = useTranslations();

  return (
    <article
      onClick={() => cb?.()}
      className={`rounded-xl border bg-gray-50 border-orange-950/10 shadow-md cursor-pointer justify-between flex flex-col transition hover:bg-primary/15 ${
        selected ? "border-orange-950/10" : ""
      }`}
    >
      <div className="flex items-center gap-4 p-3 ">
        <div className="w-full flex justify-between">
          <div>
            {item.Icon && <item.Icon />}
            <h3 className="line-clamp-1 text-lg text-gray-700">
              {t(item.title)}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="sm:flex sm:items-center sm:gap-2">
              <h4 className="text-2xl font-bold text-gray-800">{item.value}</h4>
            </div>
            {item.percent && (
              <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                <AiOutlineStock className="text-xl" />

                <span className="text-xs font-medium">{item.percent}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected ? "selected" : "not-selected"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-end "
        >
          <span className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-orange-800 px-3 py-1.5 text-white text-sm">
            {selected && "selected"}
          </span>
        </motion.div>
      </AnimatePresence>
    </article>
  );
}

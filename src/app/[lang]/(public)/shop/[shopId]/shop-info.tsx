import { Song } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { CiLocationOn } from "react-icons/ci";
import { MdOutlineTableBar } from "react-icons/md";

type Props = {
  name: string;
  address: string;
  table: string;
  currentPlayingSong: Song | undefined;
};

const ShopInfo = async ({ name, address, table }: Props) => {
  const t = await getTranslations();

  return (
    <div className="flex flex-wrap gap-x-5 items-center">
      <h1 className="text-2xl font-semibold">{name}</h1>
      <div className="flex items-center gap-x-2">
        <CiLocationOn className="text-primary" />
        <span className="text-primary font-medium">{t("Cafe Location")}:</span>
        <span className="font-semibold text-gray-400">{address}</span>
      </div>
      <div className="flex items-center gap-x-2">
        <MdOutlineTableBar className="text-primary" />
        <span className="text-primary font-medium">{t("Table No")}:</span>
        <span className="font-semibold text-gray-400">{table || "-"}</span>
      </div>
    </div>
  );
};

export default ShopInfo;

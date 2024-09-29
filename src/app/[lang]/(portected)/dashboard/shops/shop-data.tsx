import React from "react";
import { CoffeeShop, User } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaDollarSign,
  FaCreditCard,
  FaBuilding,
  FaFileContract,
  FaUserCircle,
} from "react-icons/fa";

type Props = { data?: CoffeeShop & { admin: User } };

const ShopData = ({ data: shop }: Props) => {
  const t = useTranslations();
  if (!shop) return null;

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number | null | undefined;
  }) => (
    <div className="flex items-center gap-2 text-gray-600">
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{label}:</span>
      <span>{value || "-"}</span>
    </div>
  );

  return (
    <div className="p-8 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-4 md:space-y-0 md:space-x-8 mb-8">
        {shop.logo && (
          <Image
            src={shop.logo}
            alt={t("Shop Logo")}
            width={150}
            height={150}
            className="rounded-full shadow-md"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{shop.name}</h1>
          <p className="text-xl text-gray-600 mt-2">{shop.admin.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("Shop Details")}
          </h2>
          <div className="space-y-3">
            <InfoItem
              icon={FaMapMarkerAlt}
              label={t("Location")}
              value={`${shop.city}, ${shop.country}`}
            />
            <InfoItem
              icon={FaDollarSign}
              label={t("Song Price")}
              value={`$${shop.songPrice}`}
            />
            <InfoItem icon={FaCreditCard} label={t("IBAN")} value={shop.iban} />
            <InfoItem
              icon={FaBuilding}
              label={t("Bank")}
              value={shop.bankName}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("Owner Details")}
          </h2>
          <div className="space-y-3">
            <InfoItem
              icon={FaUserCircle}
              label={t("Name")}
              value={shop.admin.name}
            />

            <InfoItem
              icon={FaPhone}
              label={t("Phone")}
              value={shop.admin.phoneNumber}
            />
            <InfoItem
              icon={FaPhone}
              label={t("Other Phone")}
              value={shop.admin.otherPhone}
            />
            <InfoItem
              icon={FaEnvelope}
              label={t("Email")}
              value={shop.admin.email}
            />
            <InfoItem
              icon={FaFileContract}
              label={t("Commercial Registration Number")}
              value={shop.admin.commercialRegistrationNumber}
            />
            <InfoItem
              icon={FaGlobe}
              label={t("Website")}
              value={shop.admin.website}
            />
          </div>
        </div>
      </div>

      {/* {shop.location && (
        <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("Shop Location")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={FaMapMarkerAlt} label={t("Latitude")} value={shop.location.latitude} />
            <InfoItem icon={FaMapMarkerAlt} label={t("Longitude")} value={shop.location.longitude} />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ShopData;

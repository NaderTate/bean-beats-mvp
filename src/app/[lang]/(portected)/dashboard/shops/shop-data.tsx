import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CoffeeShop, User } from "@prisma/client";
import {
  FaPhone,
  FaGlobe,
  FaEnvelope,
  FaBuilding,
  FaDollarSign,
  FaCreditCard,
  FaUserCircle,
  FaFileContract,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { MdAccountBalanceWallet } from "react-icons/md";

type Props = {
  data?: CoffeeShop & {
    admin: User;
    location?: { lat: number; lng: number };
  };
};

const ShopData = ({ data: shop }: Props) => {
  const t = useTranslations();
  if (!shop) return null;

  const InfoItem = ({
    icon: Icon,
    label,
    value,
    link,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number | null | undefined;
    link?: string;
  }) => (
    <div className="flex items-center gap-2 text-gray-600">
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{label}:</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {value || "-"}
        </a>
      ) : (
        <span>{value || "-"}</span>
      )}
    </div>
  );

  const getGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

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
              value={
                shop.location
                  ? `${t(shop.city)}, ${t(shop.country)} (${t("View on Map")})`
                  : `${shop.city}, ${shop.country}`
              }
              link={
                shop.location
                  ? getGoogleMapsLink(shop.location.lat, shop.location.lng)
                  : undefined
              }
            />
            <InfoItem
              icon={FaDollarSign}
              label={t("Song Price")}
              value={`$${shop.songPrice}`}
            />
            <InfoItem
              icon={FaBuilding}
              label={t("Bank")}
              value={shop.bankName}
            />
            <InfoItem icon={FaCreditCard} label={t("IBAN")} value={shop.iban} />
            <InfoItem
              icon={MdAccountBalanceWallet}
              label={t("Account number")}
              value={shop.accountNumber}
            />
            <InfoItem
              icon={MdAccountBalanceWallet}
              label={t("Tax Number")}
              value={shop.taxNumber}
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
    </div>
  );
};

export default ShopData;

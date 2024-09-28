import { AdminPermission } from "@prisma/client";
import {
  FcNext,
  FcShop,
  FcMusic,
  FcBarChart,
  FcMoneyTransfer,
  FcConferenceCall,
} from "react-icons/fc";
import { IoIosPeople } from "react-icons/io";

export const adminNavLinks = [
  {
    title: "Dashboard",
    icon: FcBarChart,
    href: "/dashboard",
    requiredPermission: AdminPermission.ALL,
  },
  {
    title: "Users",
    icon: FcConferenceCall,
    href: "/dashboard/users",
    requiredPermission: AdminPermission.ALL,
  },
  {
    title: "music",
    icon: FcMusic,
    href: "/dashboard/music",
    requiredPermission: AdminPermission.UPLOAD_MUSIC,
  },
  {
    title: "Employees",
    icon: IoIosPeople,
    href: "/dashboard/employees",
    requiredPermission: AdminPermission.ALL,
  },
  {
    title: "Transactions",
    icon: FcMoneyTransfer,
    href: "/dashboard/transactions",
    requiredPermission: AdminPermission.VIEW_TRANSACTIONS,
  },
  {
    title: "Shops",
    icon: FcShop,
    href: "/dashboard/shops",
    requiredPermission: AdminPermission.ALL,
  },
];

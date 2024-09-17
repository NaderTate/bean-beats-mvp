import { IconType } from "react-icons";

import { FaMusic } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { FaCreditCard } from "react-icons/fa6";
import { HiMiniQueueList } from "react-icons/hi2";

export const navData: Array<{ link: string; name: string; icon: IconType }> = [
  { link: "", name: "Home", icon: IoMdHome },
  { link: "payment", name: "Payment", icon: FaCreditCard },
  { link: "queue", name: "Queue", icon: HiMiniQueueList },
  { link: "music", name: "Music", icon: FaMusic },
];

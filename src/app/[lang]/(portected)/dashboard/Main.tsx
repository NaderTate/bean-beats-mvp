"use client";

import SongsList from "@/components/shared/List/songs";
import NCard from "@/components/shared/Cards/numeric-card";
import LineChart from "@/components/shared/Charts/line-chart";

import { FaShop } from "react-icons/fa6";
import { FaMoneyBillWave, FaMusic } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useGetLang from "@/hooks/use-get-lang";

const list = [
  {
    Icon: () => <FaMoneyBillWave className="text-4xl text-green-500" />,
    title: "Total Revenue",
    value: 240.94,
    percent: "67.81%",
    href: "/dashboard/transactions",
  },
  {
    Icon: () => <FaShop className="text-4xl text-blue-500" />,
    title: "Coffee Shops",
    value: 64,
    href: "/dashboard/shops",
  },

  {
    Icon: () => <FaMusic className="text-4xl text-yellow-500" />,
    title: "Songs",
    value: 1600,
    href: "/dashboard/music?secion=Songs",
  },
];

const songs = [
  {
    title: "Sky fall",
    price: "$2",
    singer: "Adele",
    image: "/images/only-logo.png",
  },
  {
    title: "Hello",
    price: "$1.5",
    singer: "Adele",
    image: "/images/only-logo.png",
  },
  {
    title: "Believer",
    price: "$3",
    singer: "Imagine Dragons",
    image: "/images/only-logo.png",
  },
  {
    title: "Thunder",
    price: "$2.5",
    singer: "Imagine Dragons",
    image: "/images/only-logo.png",
  },
  {
    title: "Demons",
    price: "$2",
    singer: "Imagine Dragons",
    image: "/images/only-logo.png",
  },
  {
    title: "Radioactive",
    price: "$2",
    singer: "Imagine Dragons",
    image: "/images/only-logo.png",
  },
  {
    title: "Bad Liar",
    price: "$2.5",
    singer: "Imagine Dragons",
    image: "/images/only-logo.png",
  },
  {
    title: "Natural",
    price: "$2",
    singer: "Imagine Dragons",
    image: "/images/only-logo.png",
  },
];

interface MainProps {
  topSongs: {
    artist: {
      name: string;
    } | null;
    title: string;
    thumbnail: string;
  }[];
}
const Main = ({ topSongs }: MainProps) => {
  const t = useTranslations();
  const { lang } = useGetLang();
  const { push } = useRouter();

  return (
    <main className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <section className=" grid col-span-1 gap-4  lg:grid-cols-3">
        {list.map((item) => (
          <NCard
            key={item.title + "section1"}
            item={item}
            cb={() => push(`/${lang}${item.href}`)}
          />
        ))}
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-8 pt-10 ">
        <div className="col-span-1 md:col-span-2 lg:col-span-5 border border-gray-200 rounded-xl shadow-md bg-white">
          <LineChart
            data={{
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [
                {
                  label: t("Shops"),
                  data: [0, 3, 8, 8, 12, 13, 25, 30, 35, 40, 45, 50],
                  fill: false,
                  backgroundColor: "#10B981",
                  borderColor: "#10B981",
                  cubicInterpolationMode: "monotone",
                },
                {
                  label: t("Revenue"),
                  data: [
                    5, 122, 100, 90, 50, 230, 200, 300, 250, 400, 350, 500,
                  ],
                  fill: false,
                  backgroundColor: "#3B82F6",
                  borderColor: "#3B82F6",
                  cubicInterpolationMode: "monotone",
                },
              ],
            }}
          />
        </div>
        <SongsList topSongs={topSongs} />
      </section>
    </main>
  );
};

export default Main;

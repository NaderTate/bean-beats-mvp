import { NextPage } from "next";
import { Suspense } from "react";

import {
  getMostSoldSongs,
  getSongSalesOverTime,
  getSalesByArea,
  getPeakTimes,
} from "./utils";

import MostSoldSongs from "./most-sold-songs";
import SalesTrend from "./sales-trend";
import SalesByArea from "./sales-by-area";
import PeakTimes from "./peak-times";

type ReportsPageProps = {};

const ReportsPage: NextPage = async ({}: ReportsPageProps) => {
  const mostSoldSongs = await getMostSoldSongs(10);
  const salesOverTime = await getSongSalesOverTime();
  // new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  // new Date()
  const salesByArea = await getSalesByArea();
  const peakTimes = await getPeakTimes("defaultShopId"); // You might want to make this dynamic
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="">
          <Suspense fallback={<div>Loading most sold songs...</div>}>
            <MostSoldSongs songs={mostSoldSongs} />
          </Suspense>
          <Suspense fallback={<div>Loading sales trend...</div>}>
            <SalesTrend salesData={salesOverTime} />
          </Suspense>
          <Suspense fallback={<div>Loading sales by area...</div>}>
            <SalesByArea salesData={salesByArea} />
          </Suspense>
          <Suspense fallback={<div>Loading peak times...</div>}>
            <PeakTimes peakTimesData={peakTimes} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;

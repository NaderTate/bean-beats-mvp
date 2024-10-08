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

import MostSoldSongsSkeleton from "./most-sold-songs-skeleton";
import SalesTrendSkeleton from "./sales-trend-skeleton";
import SalesByAreaSkeleton from "./sales-by-area-skeleton";
import PeakTimesSkeleton from "./peak-times-skeleton";

type ReportsPageProps = {};

const ReportsPage: NextPage = async ({}: ReportsPageProps) => {
  const mostSoldSongs = await getMostSoldSongs(10);
  const salesOverTime = await getSongSalesOverTime();
  const salesByArea = await getSalesByArea();
  const peakTimes = await getPeakTimes();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Suspense fallback={<MostSoldSongsSkeleton />}>
            <MostSoldSongs songs={mostSoldSongs} />
          </Suspense>
          <Suspense fallback={<SalesTrendSkeleton />}>
            <SalesTrend salesData={salesOverTime} />
          </Suspense>
          <Suspense fallback={<SalesByAreaSkeleton />}>
            <SalesByArea salesData={salesByArea} />
          </Suspense>
          <Suspense fallback={<PeakTimesSkeleton />}>
            <PeakTimes peakTimesData={peakTimes} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;

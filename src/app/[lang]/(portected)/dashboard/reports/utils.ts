"use server";
import prisma from "@/lib/prisma";
// import { Prisma } from "@prisma/client";

type SalesData = {
  date: string;
  count: number;
  totalAmount: number;
  shopId: string;
  shopName: string;
};

// type SalesByArea = Prisma.TransactionGroupByOutputType;

type EnrichedSalesByArea = {
  city: string | null;
  district: string | null;
  transactionCount: number;
  totalAmount: number | null;
};

type PeakTimeData = {
  hour: number;
  transactionCount: number;
  totalAmount: number;
  shopId: string;
  shopName: string;
};

export const getMostSoldSongs = async (limit = 10) => {
  const mostSoldSongs = await prisma.song.findMany({
    orderBy: {
      timesPurchased: "desc",
    },
    take: limit,
    include: {
      artist: {
        select: {
          name: true,
        },
      },
      album: {
        select: {
          name: true,
        },
      },
    },
  });

  return mostSoldSongs.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist?.name ?? "", // Ensure artist is always a string
    album: song.album?.name ?? "", // Ensure album is always a string
    timesPurchased: song.timesPurchased,
  }));
};

export const getSongSalesOverTime = async (): Promise<SalesData[]> => {
  const sales = await prisma.transaction.groupBy({
    by: ["createdAt", "shopId"],
    where: {
      status: "COMPLETED" as const,
    },
    _count: {
      id: true,
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const shopsInfo = await prisma.coffeeShop.findMany({
    select: { id: true, name: true },
  });

  const shopMap = new Map(shopsInfo.map((shop) => [shop.id, shop.name]));

  return sales.map((sale) => ({
    date: sale.createdAt.toISOString(),
    count: sale._count.id,
    totalAmount: sale._sum.amount ?? 0,
    shopId: sale.shopId,
    shopName: shopMap.get(sale.shopId) || "Unknown Shop",
  }));
};

export const getSalesByArea = async (): Promise<EnrichedSalesByArea[]> => {
  const salesByArea = await prisma.transaction.groupBy({
    by: ["shopId"],
    where: {
      status: "COMPLETED",
    },
    _count: {
      id: true,
    },
    _sum: {
      amount: true,
    },
  });

  const enrichedSalesByArea = await Promise.all(
    salesByArea.map(async (sale) => {
      const shop = await prisma.coffeeShop.findUnique({
        where: { id: sale.shopId },
        select: { city: true, district: true },
      });

      if (!shop) {
        throw new Error(`Shop not found for id: ${sale.shopId}`);
      }

      return {
        city: shop.city ?? "Unknown", // Default to "Unknown" if city is null
        district: shop.district ?? "Unknown", // Handle district similarly
        transactionCount: sale._count.id,
        totalAmount: sale._sum.amount ?? 0, // Handle possible null totalAmount
      };
    })
  );

  return enrichedSalesByArea;
};

export const getPeakTimes = async (): Promise<PeakTimeData[]> => {
  const transactions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
    },
    select: {
      createdAt: true,
      amount: true,
      shopId: true,
      shop: {
        select: {
          name: true,
        },
      },
    },
  });

  const peakTimes: Record<string, PeakTimeData> = {};

  for (const transaction of transactions) {
    const hour = transaction.createdAt.getHours();
    const key = `${transaction.shopId}-${hour}`;

    if (!(key in peakTimes)) {
      peakTimes[key] = {
        hour,
        transactionCount: 0,
        totalAmount: 0,
        shopId: transaction.shopId,
        shopName: transaction.shop.name,
      };
    }

    peakTimes[key].transactionCount += 1;
    peakTimes[key].totalAmount += transaction.amount ?? 0;
  }

  return Object.values(peakTimes).sort(
    (a, b) => a.shopName.localeCompare(b.shopName) || a.hour - b.hour
  );
};

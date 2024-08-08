"use client";

import Image from "next/image";
import { Song } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/shared/spinner";
import { getMultipleSongs } from "@/actions/songs";

import { PayPalBtn } from "./paypal-btn";
import { createTransaction } from "@/actions/transactions";
import { useSongsCart } from "@/store/songs-cart";
import Link from "next/link";

function getDayOfWeek() {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const dayName = daysOfWeek[today.getDay()];

  return dayName;
}

type PaymentMainProps = { shopId: string };

export const PaymentMain = ({ shopId }: PaymentMainProps) => {
  const [songs, setSongs] = useState<
    (Song & { artist: { name: string } | null })[] | null
  >(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { setSongs: setLocalSongs } = useSongsCart();

  const { push } = useRouter();

  useEffect(() => {
    const songsIds = localStorage.getItem("songs")
      ? JSON.parse(localStorage.getItem("songs") || "[]")
      : [];

    getMultipleSongs(songsIds).then((songs) => {
      setSongs(songs);
      const total = songs.reduce((acc, song) => acc + song.price, 0);
      setTotalAmount(total);
    });
  }, []);

  if (!songs) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="bg-gray-100 py-5 px-10 rounded-lg flex flex-col items-center border-gray-300 border">
          <h1 className="text-2xl font-medium">No songs selected</h1>
          <Link href={`/shop/${shopId}/music`}>
            <button className="bg-primary text-white rounded-lg px-5 py-2 mt-5">
              Browse Songs
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className=" lg:w-2/5 m-auto">
      {songs.map((song) => (
        <div
          key={song.id}
          className="inline-flex w-full gap-3 bg-slate-50 p-5 rounded-lg border"
        >
          <Image
            src={song.thumbnail}
            alt={song.title}
            width={100}
            height={100}
            className="w-28 h-28 object-cover object-top rounded-lg"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-primary font-semibold">{song.title}</h3>
            <p className="text-gray-500">{song.artist?.name}</p>
            <span className="text-gray-500">Price: {song.price}</span>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-5 mt-5 bg-slate-50 p-5 rounded-lg border">
        <div className="flex flex-col text-primary-500 font-semibold gap-4">
          <span>Day: </span>
          <span>Time: </span>
          <span>Table: </span>
          <span>Number of songs: </span>
        </div>
        <div className="flex flex-col gap-4 text-gray-500 ">
          <span>{getDayOfWeek()}</span>
          <span>{new Date().toLocaleTimeString()}</span>
          <span>20</span>
          <span>{songs.length}</span>
        </div>
        <span className="border-b-4 my-4 border-dashed col-span-2 "></span>
        <div>
          <h3 className="text-primary font-semibold text-xl">summary</h3>
          <div className="flex justify-between pt-6">
            <span className="text-primary-500 font-semibold">Total cost:</span>
            <span>{totalAmount} SAR</span>
          </div>
        </div>
      </div>
      <PayPalBtn
        action="order"
        amount={totalAmount}
        onPaymentSuccess={async () => {
          await createTransaction({
            shopId,
            songsIds: songs.map((song) => song.id),
            tableNumber: 20,
          });
          localStorage.removeItem("songs");
          setLocalSongs([]);
          push(`/shop/${shopId}/payment/success`);
        }}
      />
    </div>
  );
};

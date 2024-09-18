"use client";

import Image from "next/image";
import { Song } from "@prisma/client";
import { useEffect, useState } from "react";
import Spinner from "@/components/shared/spinner";
import { getMultipleSongs } from "@/actions/songs";
import { useTranslations } from "next-intl";
import SubscribeComponent from "@/components/subscribe-component";
import NotFound from "@/components/not-found";
import { FiMinusCircle } from "react-icons/fi";
import { MdAddCircleOutline } from "react-icons/md";

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
  const t = useTranslations();
  const [tableNumber, setTableNumber] = useState<string>("");
  const [songs, setSongs] = useState<
    | {
        song: {
          artist: {
            id: string;
            name: string;
            image: string;
            coffeeShopsIds: string[];
          } | null;
        } & Song;
        id: string;
        price: number;
        quantity: number;
      }[]
    | null
  >(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Helper functions to interact with localStorage
  const getStoredSongs = () => {
    if (typeof window !== "undefined") {
      const storedSongs = localStorage.getItem("songs");
      return storedSongs ? JSON.parse(storedSongs) : {};
    }
    return {};
  };

  const setStoredSongs = (songsData: { [key: string]: number }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("songs", JSON.stringify(songsData));
    }
  };

  useEffect(() => {
    const storedSongs = getStoredSongs();
    const songsIds = Object.keys(storedSongs);

    getMultipleSongs({ shopId, songsIds }).then((songsData) => {
      const songsWithQuantities = songsData.map((song) => ({
        ...song,
        quantity: storedSongs[song.song.id] || 1,
      }));
      setSongs(songsWithQuantities);

      const total = songsWithQuantities.reduce(
        (acc, song) => acc + song.price * song.quantity,
        0
      );
      setTotalAmount(total);
    });
  }, [shopId]);

  const handleIncreaseQuantity = (songId: string) => {
    const updatedSongs = songs?.map((song) => {
      if (song.song.id === songId) {
        return { ...song, quantity: song.quantity + 1 };
      }
      return song;
    });

    setSongs(updatedSongs || null);

    // Update localStorage
    const storedSongs = getStoredSongs();
    const currentQuantity = storedSongs[songId] || 0;
    storedSongs[songId] = currentQuantity + 1;
    setStoredSongs(storedSongs);

    // Recalculate total amount
    const total = updatedSongs?.reduce(
      (acc, song) => acc + song.price * song.quantity,
      0
    );
    setTotalAmount(total || 0);
  };

  const handleDecreaseQuantity = (songId: string) => {
    const updatedSongs = songs
      ?.map((song) => {
        if (song.song.id === songId) {
          const newQuantity = song.quantity - 1;
          return { ...song, quantity: newQuantity };
        }
        return song;
      })
      .filter((song) => song.quantity > 0); // Remove songs with quantity 0

    setSongs(updatedSongs || null);

    // Update localStorage
    const storedSongs = getStoredSongs();
    const currentQuantity = storedSongs[songId] || 0;
    if (currentQuantity <= 1) {
      delete storedSongs[songId];
    } else {
      storedSongs[songId] = currentQuantity - 1;
    }
    setStoredSongs(storedSongs);

    // Recalculate total amount
    const total = updatedSongs?.reduce(
      (acc, song) => acc + song.price * song.quantity,
      0
    );
    setTotalAmount(total || 0);
  };

  if (!songs) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (songs.length === 0) {
    return <NotFound label={t("No songs selected")} />;
  }

  return (
    <div className="lg:w-2/5 m-auto">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex w-full gap-3 bg-slate-50 p-5 rounded-lg border my-2"
        >
          <Image
            src={song.song.thumbnail}
            alt={song.song.title}
            width={100}
            height={100}
            className="w-28 h-28 object-cover object-top rounded-lg"
          />
          <div className="flex flex-col gap-1 flex-grow">
            <h3 className="text-primary font-semibold">{song.song.title}</h3>
            <p className="text-gray-500">{song.song.artist?.name}</p>
            <span className="text-gray-500">
              {t("Price")}: {song.price} USD
            </span>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handleDecreaseQuantity(song.song.id)}
                disabled={song.quantity <= 1}
              >
                <FiMinusCircle
                  size={25}
                  className={`${
                    song.quantity <= 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-primary cursor-pointer"
                  }`}
                />
              </button>
              <span className="text-gray-500">
                {t("Quantity")}: {song.quantity}
              </span>
              <button onClick={() => handleIncreaseQuantity(song.song.id)}>
                <MdAddCircleOutline
                  size={25}
                  className="text-primary cursor-pointer"
                />
              </button>
            </div>
            <span className="text-gray-500 mt-2">
              {t("Total")}: {song.price * song.quantity} USD
            </span>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-5 mt-5 bg-slate-50 p-5 rounded-lg border">
        <div className="flex flex-col text-primary-500 font-semibold gap-4">
          <span>{t("Day")}: </span>
          <span>{t("Time")}: </span>
          <span>{t("Table")}: </span>
          <span>{t("Number of songs")}: </span>
        </div>
        <div className="flex flex-col gap-4 text-gray-500 ">
          <span>{t(getDayOfWeek())}</span>
          <span>{new Date().toLocaleTimeString()}</span>
          <input
            value={tableNumber}
            placeholder={t("Table number")}
            onChange={(e) => setTableNumber(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <span>{songs.reduce((total, song) => total + song.quantity, 0)}</span>
        </div>
        <span className="border-b-4 my-4 border-dashed col-span-2"></span>
        <div>
          <h3 className="text-primary font-semibold text-xl">{t("Summary")}</h3>
          <div className="flex justify-between pt-6">
            <span className="text-primary-500 font-semibold">
              {t("Total cost")}:
            </span>
            <span>{totalAmount} USD</span>
          </div>
        </div>
      </div>
      <SubscribeComponent
        shopId={shopId}
        description="Checkout"
        price={totalAmount.toString()}
        tableNumber={Number(tableNumber)}
        songsIds={songs.flatMap((song) =>
          Array(song.quantity).fill(song.song.id)
        )}
      />
    </div>
  );
};

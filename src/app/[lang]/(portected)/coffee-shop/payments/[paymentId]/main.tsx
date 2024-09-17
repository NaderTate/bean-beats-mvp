import Input from "@/components/shared/Input";
import { Song, Transaction } from "@prisma/client";
import SongsList from "./songs-list";

type Props = {
  transaction: Transaction;
};

const Main = ({ transaction }: Props) => {
  return (
    <div className="w-full p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input value={transaction.tableNumber} disabled label="Table No" />
        <Input value={transaction.songs.length} disabled label="No of songs" />
        <Input
          value={new Date(transaction.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
          disabled
          label="Date"
        />
        <Input
          value={transaction.amount + " USD"}
          disabled
          label="Total Cost"
        />
      </div>
      {/* @ts-ignore */}
      <SongsList songs={transaction.songs} />
    </div>
  );
};

export default Main;

"use client";

import { useState } from "react";
import Songs from "../../music/songs";

type Props = {};

const ArtistMain = (props: Props) => {
  type sections = "songs" | "albums";
  const [section, setSection] = useState<sections>("songs");
  const buttons: Array<{
    name: string;
    value: sections;
  }> = [
    { name: "Songs", value: "songs" },
    { name: "Albums", value: "albums" },
  ];
  return (
    <div className="pt-20 p-5">
      {buttons.map((button) => (
        <button
          key={button.value}
          onClick={() => setSection(button.value)}
          className={`${
            section === button.value
              ? "bg-primary text-white "
              : "bg-gray-100 text-gray-900 border-gray-300 border"
          }  px-9 py-3 transition rounded-full mx-2`}
        >
          {button.name}
        </button>
      ))}
      {section === "songs" && <Songs songs={[]} />}
    </div>
  );
};

export default ArtistMain;

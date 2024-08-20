import { useTranslations } from "next-intl";

import { IconType } from "react-icons";

type Props = {
  data: { label: string; value: number; icon: IconType; iconColor?: string }[];
};

const Analytics = ({ data }: Props) => {
  const t = useTranslations();

  return (
    <div className="ml-10 grid grid-cols-1 md:grid-cols-3 justify-between gap-20">
      {data.map((item, index) => (
        <div
          key={index}
          className="items-center flex gap-5 p-4 rounded-lg shadow-sm"
        >
          <item.icon className={item.iconColor} size={35} />
          <div>
            <p className="text-lg font-semibold">{item.value}</p>
            <p className="text-sm text-gray-500">{t(item.label)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Analytics;

import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";
import React from "react";

const extraData = [
  {
    title: "Free Delivery",
    description: "Free shipping over IDR 999.999",
    icon: <Truck size={45} />,
  },
  {
    title: "Free Return",
    description: "Return your items before 7 days",
    icon: <GitCompareArrows size={45} />,
  },
  {
    title: "Customer Support",
    description: "Friendly 24/7 customer support",
    icon: <Headset size={45} />,
  },
  {
    title: "Money Back guarantee",
    description: "Quality checked by our team",
    icon: <ShieldCheck size={45} />,
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 shadow-sm hover:shadow-dark-grey py-5 hoverEffect">
      {extraData?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 group hover:text-dark-grey"
        >
          <span className="inline-flex scale-100 group-hover:scale-90 hoverEffect">
            {item?.icon}
          </span>
          <div className="text-sm">
            <p className="text-black/80 font-bold capitalize">{item?.title}</p>
            <p className="text-black/70">{item?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;

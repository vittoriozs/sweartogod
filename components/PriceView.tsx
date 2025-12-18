import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  const hasDiscount = typeof discount === "number" && discount > 0;

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <PriceFormatter amount={price} className="text-black/70" />

        {hasDiscount && price !== undefined && (
          <PriceFormatter
            amount={price + (discount! * price) / 100}
            className="line-through text-xs font-normal text-zinc-500"
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;

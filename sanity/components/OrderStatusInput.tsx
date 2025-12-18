import { Stack, Select, Text } from "@sanity/ui";
import { set, unset } from "sanity";
import { useFormValue } from "sanity";

const STATUS_BY_METHOD = {
  pickup: [
    { title: "Pending", value: "pending" },
    { title: "Paid", value: "paid" },
    { title: "Ready to Pick Up", value: "ready_to_pick_up" },
    { title: "Done Pick Up", value: "done_pick_up" },
  ],
  delivery: [
    { title: "Pending", value: "pending" },
    { title: "Paid", value: "paid" },
    { title: "Shipped", value: "shipped" },
    { title: "Delivered", value: "delivered" },
  ],
};

export default function OrderStatusInput(props: any) {
  const { value, onChange } = props;

  const deliveryMethod = useFormValue(["deliveryMethod"]) as
    | "pickup"
    | "delivery"
    | undefined;

  const options =
    deliveryMethod === "pickup"
      ? STATUS_BY_METHOD.pickup
      : STATUS_BY_METHOD.delivery;

  return (
    <Stack space={2}>
      {!deliveryMethod && (
        <Text size={1} muted>
          Select delivery method first
        </Text>
      )}

      <Select
        value={value ?? ""}
        disabled={!deliveryMethod}
        onChange={(e) => {
          const target = e.target as HTMLSelectElement;
          const nextValue = target.value;

          onChange(nextValue ? set(nextValue) : unset());
        }}
      >
        <option value="" />
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </Select>
    </Stack>
  );
}

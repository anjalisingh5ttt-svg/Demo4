"use client";

import dynamic from "next/dynamic";

type InvoiceProps = {
  order: any;
  buttonText?: string;
  variant?: "primary" | "secondary" | "outline";
};

const InvoiceGeneratorImpl = dynamic<InvoiceProps>(
  () => import("./InvoiceGeneratorImpl"),
  { ssr: false }
);

export default function InvoiceGenerator({
  order,
  buttonText = "Download Invoice",
  variant = "primary",
}: {
  order: any;
  buttonText?: string;
  variant?: "primary" | "secondary" | "outline";
}) {
  return (
    <InvoiceGeneratorImpl
      order={order}
      buttonText={buttonText}
      variant={variant}
    />
  );
}

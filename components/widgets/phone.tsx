"use client";
import Widget from "../widget";

export default function PhoneWidget({ message }: { message: number | null }) {
  return (
    <Widget
      title="Phone"
      image="/phone.svg"
      loading={false}
      imageLoading={false}
    >
      <p>Phone</p>
    </Widget>
  );
}

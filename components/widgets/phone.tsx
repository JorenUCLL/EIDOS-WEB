"use client";
import Widget from "../widget";

export default function PhoneWidget() {
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

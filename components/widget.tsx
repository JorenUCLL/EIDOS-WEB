"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface Props {
  title: string;
  image: string;
  children: ReactNode;
}

export default function Widget({ title, image, children }: Props) {
  return (
    <section className="flex flex-col gap-20">
      <div className="flex flex-col gap-10">
        <h1 className="justify-center flex text-3xl">{title}</h1>

        <div className="justify-center flex">
          <Image src={image} alt="Phone" width={200} height={200} />
        </div>
      </div>

      {children}
    </section>
  );
}

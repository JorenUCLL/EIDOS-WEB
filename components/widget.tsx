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
          <Image
            src={image}
            alt={title + " image"}
            height={200}
            width={200}
            objectFit="contain"
            className=" h-52 w-auto objec"
          />
        </div>
      </div>

      {children}
    </section>
  );
}

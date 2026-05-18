"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

interface Props {
  title: string;
  image: string;
  children: ReactNode;
  loading: boolean;
  imageLoading: boolean;
}

export default function Widget({
  title,
  image,
  children,
  loading,
  imageLoading,
}: Props) {
  return (
    <section className="flex flex-col gap-20">
      <div className="flex flex-col items-center gap-10">
        <h1 className="justify-center flex text-3xl">{title}</h1>

        {imageLoading ? (
          <Skeleton className="h-52 w-52 rounded-2xl" />
        ) : (
          <Image
            src={image}
            alt={title + " image"}
            height={200}
            width={200}
            className=" h-52 w-auto object-contain"
            loading="eager"
          />
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <Spinner className="size-8" />
        </div>
      )}
      {!loading && children}
    </section>
  );
}

import Radio from "@/components/widgets/radio";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-200 h-screen text-black">
      <h1 className="justify-center flex text-3xl mt-10">BCI - Web</h1>

      <div className="justify-center flex mt-40">
        <Image src="/phone.svg" alt="Phone" width={200} height={200} />
      </div>

      <Radio />
    </main>
  );
}

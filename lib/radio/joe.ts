import { DpgMediaApiChannel, DpgMediaApiResponse, RadioChannel } from "@/types";
import Provider from "./provider";

class Joe extends Provider {
  async fetchChannels(): Promise<Record<string, RadioChannel>> {
    const res = await fetch("https://api.joe.be/2.9/channels");
    const data: DpgMediaApiResponse = await res.json();
    return Object.values(data.data).reduce(
      (acc: Record<string, RadioChannel>, channel: DpgMediaApiChannel) => {
        const id = channel.data.station_id;
        acc[id] = {
          id,
          name: channel.data.name,
          streamUrl: channel.data.streams.mp3![0].source,
          imageUrl: channel.data.logo.app_logo,
          type: "joe",
        };
        return acc;
      },
      {},
    );
  }
}

export default Joe
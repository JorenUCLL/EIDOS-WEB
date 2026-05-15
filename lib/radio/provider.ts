import { RadioChannel } from "@/types";

abstract class Provider {
  abstract fetchChannels(): Promise<Record<string, RadioChannel>>;
}

export default Provider;
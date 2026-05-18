export type RadioChannel = {
  id: string;
  name: string;
  streamUrl: string;
  imageUrl: string | null;
  type: "qmusic" | "joe";
};

export type DpgMediaApiChannel = {
  id: number;
  type: "channel";
  published_start: number;
  published_stop: number;
  color: {
    background: string;
    foreground: string;
    extra: string;
    widget_background: string;
    widget_foreground: string;
  };
  data: {
    id: string;
    background_image: string | null;
    name: string;
    api_url: string;
    station_id: string;
    slug: string;
    tagline: string;
    logo: Record<string, string | null>;
    logo_relative: Record<string, string | null>;
    streams: {
      mp3?: Array<{ source: string; options: null; extra: null }>;
      aac?: Array<{ source: string; options: null; extra: null }>;
      mobile?: { audio: string; video?: string; live: string };
      android?: { high: string; low: string; video: string };
      iphone?: { live: string; video: string };
      [key: string]: unknown;
    };
    search_terms: string[];
  };
  locations: unknown[];
};

export type DpgMediaApiResponse = {
  data: DpgMediaApiChannel[];
};
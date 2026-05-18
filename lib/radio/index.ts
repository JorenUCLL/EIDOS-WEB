import Joe from "./joe";
import Qmusic from "./qmusic";

const providers = {
  "qmusic": new Qmusic(),
  "joe": new Joe()
}

export default providers;
import { Widget } from "@/types";
import { MessageCircleIcon, RadioIcon } from "lucide-react";
import RadioWidget from "./radio";
import TextWidget from "./text";

const getAll = (): Widget[] => {
  return [
    {
      id: "radio",
      name: "Radio",
      widget: RadioWidget,
      icon: RadioIcon
    },
    {
      id: "sos",
      name: "SOS Message",
      widget: TextWidget,
      icon: MessageCircleIcon
    },
  ];
}

const getById = (id: string): number => {
  const widgets = getAll();
  const index = widgets.findIndex(widget => widget.id === id);
  return index !== -1 ? index : 0;
}

const exportable = { getAll, getById }

export default exportable;
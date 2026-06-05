import { Widget } from "@/types";
import { RadioIcon } from "lucide-react";
import RadioWidget from "./radio";

const getAll = (): Widget[] => {
  return [
    {
      id: "radio",
      name: "Radio",
      widget: RadioWidget,
      icon: RadioIcon
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
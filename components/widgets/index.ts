import { Widget } from "@/types";
import PhoneWidget from "./phone";
import RadioWidget from "./radio";
import { PhoneIcon, RadioIcon } from "lucide-react";
import Radio2Widget from "./radio2";

const getAll = (): Widget[] => {
  return [
    {
      id: "radio",
      name: "Radio",
      widget: RadioWidget,
      icon: RadioIcon
    },
    {
      id: "radio2",
      name: "Radio2",
      widget: Radio2Widget,
      icon: RadioIcon
    },
    {
      id: "phone",
      name: "Phone",
      widget: PhoneWidget,
      icon: PhoneIcon
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
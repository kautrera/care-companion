import type { ImgHTMLAttributes } from "react";
import type { NeedSlug } from "../lib/types";

import hunger from "./images/patient/hunger.png";
import thirst from "./images/patient/thirst.png";
import bathroom from "./images/patient/bathroom.png";
import diaper from "./images/patient/diaper.png";
import pain from "./images/patient/pain.png";
import tired from "./images/patient/tired.png";
import cold from "./images/patient/cold.png";
import hot from "./images/patient/hot.png";

import babyfood from "./images/caretaker/babyfood.png";
import bed from "./images/caretaker/bed.png";
import blanket from "./images/caretaker/blanket.png";
import brushteeth from "./images/caretaker/brushteeth.png";
import chocolate from "./images/caretaker/chocolate.png";
import closewindows from "./images/caretaker/closewindows.png";
import clothes from "./images/caretaker/clothes.png";
import coffee from "./images/caretaker/coffee.png";
import crackers from "./images/caretaker/crackers.png";
import dentures from "./images/caretaker/dentures.png";
import facialcream from "./images/caretaker/facialcream.png";
import fruit from "./images/caretaker/fruit.png";
import makeup from "./images/caretaker/makeup.png";
import massage from "./images/caretaker/massage.png";
import nightlight from "./images/caretaker/nightlight.png";
import nuts from "./images/caretaker/nuts.png";
import oatmeal from "./images/caretaker/oatmeal.png";
import orangejuice from "./images/caretaker/orangejuice.png";
import papaya from "./images/caretaker/papaya.png";
import phone from "./images/caretaker/phone.png";
import shower from "./images/caretaker/shower.png";
import smoothie from "./images/caretaker/smoothie.png";
import sofa from "./images/caretaker/sofa.png";
import soup from "./images/caretaker/soup.png";
import toast from "./images/caretaker/toast.png";
import toilet from "./images/caretaker/toilet.png";
import tv from "./images/caretaker/tv.png";
import tvremote from "./images/caretaker/tvremote.png";
import waterbottle from "./images/caretaker/waterbottle.png";
import wheelchair from "./images/caretaker/wheelchair.png";
import yogurt from "./images/caretaker/yogurt.png";

const SOURCES: Partial<Record<NeedSlug, string>> = {
  hunger,
  thirst,
  bathroom,
  diaper,
  pain,
  tired,
  cold,
  hot,
  soup,
  coffee,
  fruit,
  babyfood,
  oatmeal,
  smoothie,
  chocolate,
  yogurt,
  orangejuice,
  waterbottle,
  crackers,
  toast,
  nuts,
  closewindows,
  nightlight,
  brushteeth,
  dentures,
  makeup,
  facialcream,
  shower,
  clothes,
  blanket,
  tv,
  tvremote,
  massage,
  wheelchair,
  toilet,
  sofa,
  phone,
  bed,
  papaya,
};

/** Slugs that currently have a watercolor illustration. */
export const DRAWING_SLUGS = Object.keys(SOURCES) as NeedSlug[];

export function hasDrawing(slug: NeedSlug): boolean {
  return SOURCES[slug] !== undefined;
}

interface DrawingProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  slug: NeedSlug;
  /** Optional alt text — defaults to empty (decorative) since labels are
   *  rendered separately by the surrounding component. */
  alt?: string;
}

export function Drawing({ slug, alt = "", className, ...rest }: DrawingProps) {
  const src = SOURCES[slug];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={["select-none object-contain", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}

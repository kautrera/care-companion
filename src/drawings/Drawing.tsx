import type { ImgHTMLAttributes } from "react";
import type { NeedSlug } from "../lib/types";

import hunger from "./images/patient/hunger.webp";
import thirst from "./images/patient/thirst.webp";
import bathroom from "./images/patient/bathroom.webp";
import diaper from "./images/patient/diaper.webp";
import pain from "./images/patient/pain.webp";
import tired from "./images/patient/tired.webp";
import cold from "./images/patient/cold.webp";
import hot from "./images/patient/hot.webp";

import babyfood from "./images/caretaker/babyfood.webp";
import bed from "./images/caretaker/bed.webp";
import blanket from "./images/caretaker/blanket.webp";
import brushteeth from "./images/caretaker/brushteeth.webp";
import chocolate from "./images/caretaker/chocolate.webp";
import closewindows from "./images/caretaker/closewindows.webp";
import clothes from "./images/caretaker/clothes.webp";
import coffee from "./images/caretaker/coffee.webp";
import crackers from "./images/caretaker/crackers.webp";
import dentures from "./images/caretaker/dentures.webp";
import facialcream from "./images/caretaker/facialcream.webp";
import fruit from "./images/caretaker/fruit.webp";
import makeup from "./images/caretaker/makeup.webp";
import massage from "./images/caretaker/massage.webp";
import nightlight from "./images/caretaker/nightlight.webp";
import nuts from "./images/caretaker/nuts.webp";
import oatmeal from "./images/caretaker/oatmeal.webp";
import orangejuice from "./images/caretaker/orangejuice.webp";
import papaya from "./images/caretaker/papaya.webp";
import phone from "./images/caretaker/phone.webp";
import shower from "./images/caretaker/shower.webp";
import smoothie from "./images/caretaker/smoothie.webp";
import sofa from "./images/caretaker/sofa.webp";
import soup from "./images/caretaker/soup.webp";
import toast from "./images/caretaker/toast.webp";
import toilet from "./images/caretaker/toilet.webp";
import tv from "./images/caretaker/tv.webp";
import tvremote from "./images/caretaker/tvremote.webp";
import waterbottle from "./images/caretaker/waterbottle.webp";
import wheelchair from "./images/caretaker/wheelchair.webp";
import yogurt from "./images/caretaker/yogurt.webp";

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
      loading="lazy"
      decoding="async"
      className={["select-none object-contain", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}

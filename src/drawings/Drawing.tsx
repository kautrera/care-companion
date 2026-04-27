import type { SVGProps } from "react";
import type { NeedSlug } from "../lib/types";
import { HungerDrawing } from "./HungerDrawing";
import { ThirstDrawing } from "./ThirstDrawing";
import { BathroomDrawing } from "./BathroomDrawing";
import { DiaperDrawing } from "./DiaperDrawing";
import { PainDrawing } from "./PainDrawing";
import { TiredDrawing } from "./TiredDrawing";
import { ColdDrawing } from "./ColdDrawing";
import { HotDrawing } from "./HotDrawing";

interface DrawingProps extends SVGProps<SVGSVGElement> {
  slug: NeedSlug;
}

export function Drawing({ slug, ...rest }: DrawingProps) {
  switch (slug) {
    case "hunger":
      return <HungerDrawing {...rest} />;
    case "thirst":
      return <ThirstDrawing {...rest} />;
    case "bathroom":
      return <BathroomDrawing {...rest} />;
    case "diaper":
      return <DiaperDrawing {...rest} />;
    case "pain":
      return <PainDrawing {...rest} />;
    case "tired":
      return <TiredDrawing {...rest} />;
    case "cold":
      return <ColdDrawing {...rest} />;
    case "hot":
      return <HotDrawing {...rest} />;
  }
}

/**
 * Original patient-facing needs. These all have illustrations and may appear
 * in both the patient grid and the caretaker "Ask the patient" grid.
 */
export type CoreNeedSlug =
  | "hunger"
  | "thirst"
  | "bathroom"
  | "diaper"
  | "pain"
  | "tired"
  | "cold"
  | "hot";

/**
 * Caretaker-only sub-items. The caretaker can ask about these, but the
 * patient never proactively communicates them. They render as text tiles
 * (no illustration) for now.
 */
export type CaretakerOnlyNeedSlug =
  | "soup"
  | "coffee"
  | "fruit"
  | "babyfood"
  | "oatmeal"
  | "smoothie"
  | "chocolate"
  | "yogurt"
  | "orangejuice"
  | "waterbottle"
  | "crackers"
  | "toast"
  | "nuts"
  | "closewindows"
  | "nightlight"
  | "brushteeth"
  | "dentures"
  | "makeup"
  | "facialcream"
  | "shower"
  | "clothes"
  | "blanket"
  | "tv"
  | "tvremote"
  | "massage"
  | "wheelchair"
  | "toilet"
  | "sofa"
  | "phone"
  | "bed"
  | "papaya";

export type NeedSlug = CoreNeedSlug | CaretakerOnlyNeedSlug;

export type InteractionKind = "patient_request" | "caretaker_question";
export type InteractionResponse = "yes" | "no" | null;

export interface Patient {
  id: string;
  caretaker_user_id: string;
  name: string;
  pin_hash: string;
  pin_salt: string;
  created_at: string;
}

export interface Need {
  id: string;
  patient_id: string;
  slug: NeedSlug;
  label: string;
  enabled_patient: boolean;
  enabled_caretaker: boolean;
  sort_order: number;
}

export interface Interaction {
  id: string;
  patient_id: string;
  kind: InteractionKind;
  need_slug: NeedSlug;
  response: InteractionResponse;
  created_at: string;
}

/**
 * English labels stored in the DB at need creation time. UI never reads
 * these — it derives the displayed label from `slug` + the active language.
 * Kept so external admin views (e.g. Supabase dashboard) see readable labels.
 */
export const NEED_LABELS: Record<NeedSlug, string> = {
  hunger: "Food",
  thirst: "Water",
  bathroom: "Bathroom",
  diaper: "Diaper",
  pain: "Pain",
  tired: "Tired",
  cold: "Cold",
  hot: "Hot",

  soup: "Soup",
  coffee: "Coffee",
  fruit: "Fruit",
  babyfood: "Baby food",
  oatmeal: "Oatmeal",
  smoothie: "Smoothie",
  chocolate: "Chocolate",
  yogurt: "Yogurt",
  orangejuice: "Orange juice",
  waterbottle: "Water bottle",
  crackers: "Crackers",
  toast: "Toast",
  nuts: "Nuts",
  closewindows: "Close windows",
  nightlight: "Night light",
  brushteeth: "Brush teeth",
  dentures: "Dentures",
  makeup: "Makeup",
  facialcream: "Facial cream",
  shower: "Shower",
  clothes: "Clothes",
  blanket: "Blanket",
  tv: "TV",
  tvremote: "TV remote",
  massage: "Massage",
  wheelchair: "Wheelchair",
  toilet: "Toilet",
  sofa: "Sofa",
  phone: "Phone",
  bed: "Bed",
  papaya: "Papaya",
};

export const CORE_NEEDS: CoreNeedSlug[] = [
  "hunger",
  "thirst",
  "bathroom",
  "diaper",
  "pain",
  "tired",
  "cold",
  "hot",
];

export const CARETAKER_ONLY_NEEDS: CaretakerOnlyNeedSlug[] = [
  "soup",
  "coffee",
  "fruit",
  "babyfood",
  "oatmeal",
  "smoothie",
  "chocolate",
  "yogurt",
  "orangejuice",
  "waterbottle",
  "crackers",
  "toast",
  "nuts",
  "closewindows",
  "nightlight",
  "brushteeth",
  "dentures",
  "makeup",
  "facialcream",
  "shower",
  "clothes",
  "blanket",
  "tv",
  "tvremote",
  "massage",
  "wheelchair",
  "toilet",
  "sofa",
  "phone",
  "bed",
  "papaya",
];

/** Order all needs are seeded for new patients. */
export const DEFAULT_NEEDS: NeedSlug[] = [...CORE_NEEDS, ...CARETAKER_ONLY_NEEDS];

/** Slugs enabled by default in the patient grid. */
export const DEFAULT_ENABLED_PATIENT: NeedSlug[] = [...CORE_NEEDS];

/** Slugs enabled by default in the caretaker "Ask the patient" grid. */
export const DEFAULT_ENABLED_CARETAKER: NeedSlug[] = [
  ...CORE_NEEDS,
  ...CARETAKER_ONLY_NEEDS,
];

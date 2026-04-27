export type NeedSlug =
  | "hunger"
  | "thirst"
  | "bathroom"
  | "diaper"
  | "pain"
  | "tired"
  | "cold"
  | "hot";

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
  enabled: boolean;
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

export const NEED_LABELS: Record<NeedSlug, string> = {
  hunger: "Food",
  thirst: "Water",
  bathroom: "Bathroom",
  diaper: "Diaper",
  pain: "Pain",
  tired: "Tired",
  cold: "Cold",
  hot: "Hot",
};

export const NEED_QUESTIONS: Record<NeedSlug, string> = {
  hunger: "Are you hungry?",
  thirst: "Are you thirsty?",
  bathroom: "Do you need the bathroom?",
  diaper: "Do you need a diaper change?",
  pain: "Are you in pain?",
  tired: "Are you tired?",
  cold: "Are you cold?",
  hot: "Are you too warm?",
};

export const DEFAULT_NEEDS: NeedSlug[] = [
  "hunger",
  "thirst",
  "bathroom",
  "diaper",
  "pain",
  "tired",
  "cold",
  "hot",
];

export const DEFAULT_ENABLED: NeedSlug[] = [
  "hunger",
  "thirst",
  "bathroom",
  "diaper",
  "pain",
  "tired",
];

import type { NeedSlug } from "../lib/types";

export type Lang = "en" | "pt-BR";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "pt-BR", label: "Português (Brasil)" },
];

export interface Strings {
  appName: string;
  loading: string;

  auth: {
    signInTitle: string;
    signInSubtitle: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    newHere: string;
    createAccount: string;
    signUpTitle: string;
    signUpSubtitle: string;
    accountCreatedConfirmEmail: string;
    creating: string;
    alreadyHaveOne: string;
  };

  setup: {
    title: string;
    prompt: string;
    placeholder: string;
    continue: string;
    saving: string;
    notSignedIn: string;
    couldNotSavePatient: string;
  };

  patient: {
    homeHint: string;
    confirmYes: string;
    confirmCancel: string;
    confirmSent: string;
    sentBadge: string;
    yes: string;
    no: string;
    back: string;
    closeAria: string;
    dismissSentAria: string;
  };

  caretaker: {
    caringFor: string;
    search: string;
    askThePatient: string;
    noResults: string;
    recentActivity: string;
    seeAll: string;
    askedFor: string;
    answered: string;
    history: string;
    handToPatient: string;
    settingsAria: string;
    patientAnswered: string;
    tapToDismiss: string;
  };

  history: {
    title: string;
    search: string;
    today: string;
    days7: string;
    days30: string;
    all: string;
    allNeeds: string;
    empty: string;
    chipAsked: string;
    chipYes: string;
    chipNo: string;
    dayToday: string;
    dayYesterday: string;
    backAria: string;
  };

  settings: {
    title: string;
    patient: string;
    name: string;
    save: string;
    saving: string;
    nameSaved: string;
    needs: string;
    moveUp: string;
    moveDown: string;
    account: string;
    signedInAs: string;
    signOut: string;
    language: string;
    backAria: string;
    showInPatient: string;
    showInCaretaker: string;
    showColumnHeader: string;
    audio: string;
    voiceOver: string;
    confirmationSounds: string;
  };

  time: {
    justNow: string;
    minAgo: (n: number) => string;
    hrAgo: (n: number) => string;
    dAgo: (n: number) => string;
  };

  needs: Record<NeedSlug, string>;
  needQuestions: Record<NeedSlug, string>;
}

const en: Strings = {
  appName: "Care Companion",
  loading: "Loading…",

  auth: {
    signInTitle: "Care Companion",
    signInSubtitle: "Sign in as the caretaker.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    newHere: "New here?",
    createAccount: "Create an account",
    signUpTitle: "Create caretaker account",
    signUpSubtitle:
      "One account per family. You'll set up the patient next.",
    accountCreatedConfirmEmail:
      "Account created. Please confirm your email and then sign in.",
    creating: "Creating…",
    alreadyHaveOne: "Already have an account?",
  },

  setup: {
    title: "Set up",
    prompt:
      "What is the patient's name? It appears at the top of the caretaker view.",
    placeholder: "e.g. Grandma Rose",
    continue: "Continue",
    saving: "Saving…",
    notSignedIn: "You're not signed in.",
    couldNotSavePatient: "Could not save patient",
  },

  patient: {
    homeHint: "Tap what you need",
    confirmYes: "Yes",
    confirmCancel: "Cancel",
    confirmSent: "I'll let them know.",
    sentBadge: "Sent",
    yes: "Yes",
    no: "No",
    back: "Back",
    closeAria: "Close patient mode",
    dismissSentAria: "Dismiss",
  },

  caretaker: {
    caringFor: "Caring for",
    search: "Search needs and history…",
    askThePatient: "Ask the patient",
    noResults: 'No questions match "{query}".',
    recentActivity: "Recent activity",
    seeAll: "See all",
    askedFor: "Asked for ",
    answered: "Answered ",
    history: "History",
    handToPatient: "Hand to patient",
    settingsAria: "Settings",
    patientAnswered: "Patient answered",
    tapToDismiss: "tap to dismiss",
  },

  history: {
    title: "History",
    search: "Search history…",
    today: "Today",
    days7: "7 days",
    days30: "30 days",
    all: "All",
    allNeeds: "All needs",
    empty: "No interactions yet for this filter.",
    chipAsked: "Asked",
    chipYes: "Yes",
    chipNo: "No",
    dayToday: "Today",
    dayYesterday: "Yesterday",
    backAria: "Back",
  },

  settings: {
    title: "Settings",
    patient: "Patient",
    name: "Name",
    save: "Save",
    saving: "Saving…",
    nameSaved: "Name saved",
    needs: "Needs",
    moveUp: "Move up",
    moveDown: "Move down",
    account: "Account",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    language: "Language",
    backAria: "Back",
    showInPatient: "Show on patient grid",
    showInCaretaker: "Show in caretaker ask",
    showColumnHeader: "Show in",
    audio: "Audio",
    voiceOver: "Voice over",
    confirmationSounds: "Confirmation sounds",
  },

  time: {
    justNow: "just now",
    minAgo: (n) => `${n} min ago`,
    hrAgo: (n) => `${n} hr ago`,
    dAgo: (n) => `${n} d ago`,
  },

  needs: {
    hunger: "Hungry",
    thirst: "Thirsty",
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
    waterbottle: "Water",
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
    tv: "Watch TV",
    tvremote: "TV remote",
    massage: "Massage",
    wheelchair: "Wheelchair",
    toilet: "Toilet",
    sofa: "Sofa",
    phone: "Phone",
    papaya: "Papaya",
    bed: "Bed",
    milk: "Milk",
  },
  needQuestions: {
    hunger: "Hungry?",
    thirst: "Thirsty?",
    bathroom: "Bathroom?",
    diaper: "Diaper change?",
    pain: "Pain?",
    tired: "Tired?",
    cold: "Cold?",
    hot: "Hot?",
    soup: "Soup?",
    coffee: "Coffee?",
    fruit: "Fruit?",
    babyfood: "Baby food?",
    oatmeal: "Oatmeal?",
    smoothie: "Smoothie?",
    chocolate: "Chocolate?",
    yogurt: "Yogurt?",
    orangejuice: "Orange juice?",
    waterbottle: "Water?",
    crackers: "Crackers?",
    toast: "Toast?",
    nuts: "Nuts?",
    closewindows: "Close windows?",
    nightlight: "Night light?",
    brushteeth: "Brush teeth?",
    dentures: "Dentures?",
    makeup: "Makeup?",
    facialcream: "Facial cream?",
    shower: "Shower?",
    clothes: "Change clothes?",
    blanket: "Blanket?",
    tv: "TV?",
    tvremote: "TV remote?",
    massage: "Massager?",
    wheelchair: "Wheelchair?",
    toilet: "Toilet?",
    sofa: "Sofa?",
    phone: "Phone?",
    bed: "Bed?",
    papaya: "Papaya?",
    milk: "Do you want milk?",
  },
};

const ptBR: Strings = {
  appName: "Care Companion",
  loading: "Carregando…",

  auth: {
    signInTitle: "Care Companion",
    signInSubtitle: "Entre como cuidador(a).",
    email: "E-mail",
    password: "Senha",
    signIn: "Entrar",
    signingIn: "Entrando…",
    newHere: "Novo por aqui?",
    createAccount: "Criar conta",
    signUpTitle: "Criar conta de cuidador",
    signUpSubtitle:
      "Uma conta por família. Você configura o paciente em seguida.",
    accountCreatedConfirmEmail:
      "Conta criada. Confirme seu e-mail e depois entre.",
    creating: "Criando…",
    alreadyHaveOne: "Já tem uma conta?",
  },

  setup: {
    title: "Configuração",
    prompt:
      "Qual o nome do paciente? Aparece no topo da tela do cuidador.",
    placeholder: "ex.: Vovó Rosa",
    continue: "Continuar",
    saving: "Salvando…",
    notSignedIn: "Você não está conectado.",
    couldNotSavePatient: "Não foi possível salvar o paciente",
  },

  patient: {
    homeHint: "Toque no que você precisa",
    confirmYes: "Sim",
    confirmCancel: "Cancelar",
    confirmSent: "Vou avisar.",
    sentBadge: "Enviado",
    yes: "Sim",
    no: "Não",
    back: "Voltar",
    closeAria: "Sair do modo paciente",
    dismissSentAria: "Fechar",
  },

  caretaker: {
    caringFor: "Cuidando de",
    search: "Buscar necessidades e histórico…",
    askThePatient: "Perguntar ao paciente",
    noResults: 'Nenhuma pergunta corresponde a "{query}".',
    recentActivity: "Atividade recente",
    seeAll: "Ver tudo",
    askedFor: "Pediu ",
    answered: "Respondeu ",
    history: "Histórico",
    handToPatient: "Passar ao paciente",
    settingsAria: "Configurações",
    patientAnswered: "O paciente respondeu",
    tapToDismiss: "toque para fechar",
  },

  history: {
    title: "Histórico",
    search: "Buscar no histórico…",
    today: "Hoje",
    days7: "7 dias",
    days30: "30 dias",
    all: "Tudo",
    allNeeds: "Todas",
    empty: "Nenhuma interação para esse filtro.",
    chipAsked: "Pedido",
    chipYes: "Sim",
    chipNo: "Não",
    dayToday: "Hoje",
    dayYesterday: "Ontem",
    backAria: "Voltar",
  },

  settings: {
    title: "Configurações",
    patient: "Paciente",
    name: "Nome",
    save: "Salvar",
    saving: "Salvando…",
    nameSaved: "Nome salvo",
    needs: "Necessidades",
    moveUp: "Mover para cima",
    moveDown: "Mover para baixo",
    account: "Conta",
    signedInAs: "Conectado como",
    signOut: "Sair",
    language: "Idioma",
    backAria: "Voltar",
    showInPatient: "Mostrar para o paciente",
    showInCaretaker: "Mostrar no cuidador",
    showColumnHeader: "Visível em",
    audio: "Áudio",
    voiceOver: "Narração",
    confirmationSounds: "Sons de confirmação",
  },

  time: {
    justNow: "agora mesmo",
    minAgo: (n) => `há ${n} min`,
    hrAgo: (n) => `há ${n} h`,
    dAgo: (n) => `há ${n} d`,
  },

  needs: {
    hunger: "Fome",
    thirst: "Sede",
    bathroom: "Banheiro",
    diaper: "Fralda",
    pain: "Dor",
    tired: "Sono",
    cold: "Frio",
    hot: "Calor",
    soup: "Sopa",
    coffee: "Café",
    fruit: "Fruta",
    babyfood: "Papinha",
    oatmeal: "Mingau",
    smoothie: "Vitamina",
    chocolate: "Chocolate",
    yogurt: "Iogurte",
    orangejuice: "Suco de laranja",
    waterbottle: "Água",
    crackers: "Bolacha",
    toast: "Torrada",
    nuts: "Castanhas",
    closewindows: "Fechar janela",
    nightlight: "Luz noturna",
    brushteeth: "Escovar dentes",
    dentures: "Dentadura",
    makeup: "Maquiagem",
    facialcream: "Creme facial",
    shower: "Banho",
    clothes: "Roupa",
    blanket: "Cobertor",
    tv: "TV",
    tvremote: "Controle",
    massage: "Massagem",
    wheelchair: "Cadeira de rodas",
    toilet: "Privada",
    sofa: "Sofá",
    phone: "Celular",
    bed: "Cama",
    papaya: "Mamão",
    milk: "Leite",
  },
  needQuestions: {
    hunger: "Fome?",
    thirst: "Sede?",
    bathroom: "Banheiro?",
    diaper: "Trocar a fralda?",
    pain: "Dor?",
    tired: "Sono?",
    cold: "Frio?",
    hot: "Calor?",
    soup: "Sopa?",
    coffee: "Café?",
    fruit: "Fruta?",
    babyfood: "Papapá?",
    oatmeal: "Mingau?",
    smoothie: "Vitamina?",
    chocolate: "Chocolate?",
    yogurt: "Iogurte?",
    orangejuice: "Suco de laranja?",
    waterbottle: "Água?",
    crackers: "Bolacha?",
    toast: "Torrada?",
    nuts: "Castanhas?",
    closewindows: "Fecho a janela?",
    nightlight: "Luz noturna?",
    brushteeth: "Escovar os dentes?",
    dentures: "Dentadura?",
    makeup: "Maquiagem?",
    facialcream: "Creme de rosto?",
    shower: "Tomar banho?",
    clothes: "Trocar de roupa?",
    blanket: "Cobertor?",
    tv: "Assistir TV?",
    tvremote: "Controle?",
    massage: "Massageador?",
    wheelchair: "Cadeira de rodas?",
    toilet: "Privada?",
    sofa: "Sofá?",
    phone: "Celular?",
    bed: "Cama?",
    papaya: "Mamão?",
    milk: "Leite?",
  },
};

export const TRANSLATIONS: Record<Lang, Strings> = {
  en,
  "pt-BR": ptBR,
};

export const LOCALES: Record<Lang, string> = {
  en: "en-US",
  "pt-BR": "pt-BR",
};

export function detectInitialLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages ?? [navigator.language];
  for (const l of langs) {
    if (l && l.toLowerCase().startsWith("pt")) return "pt-BR";
  }
  return "en";
}

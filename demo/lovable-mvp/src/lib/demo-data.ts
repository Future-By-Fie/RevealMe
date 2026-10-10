/**
 * DEMO DATA ONLY — fictional people with generated photos.
 * Kept separate so it can be swapped for database queries later.
 */
import maya from "@/assets/demo-maya.jpg";
import jonas from "@/assets/demo-jonas.jpg";
import lea from "@/assets/demo-lea.jpg";
import sam from "@/assets/demo-sam.jpg";

export type DemoProfile = {
  id: string;
  name: string;
  age: number;
  photo: string;
  signal: string;
  bio: string;
  /** Whether this demo person "connects back" in the simulated flow. */
  connectsBack: boolean;
  answers: Record<string, string>;
};

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "maya",
    name: "Maya",
    age: 28,
    photo: maya,
    connectsBack: true,
    signal: "Ceramics, night swims, bad puns",
    bio: "Architect by day. I'll judge you lovingly on your coffee order.",
    answers: {
      sunday: "Farmers market, then a long nap",
      trip: "Lisbon, by train",
      laugh: "My grandmother's voice notes",
      value: "Curiosity",
    },
  },
  {
    id: "jonas",
    name: "Jonas",
    age: 31,
    photo: jonas,
    connectsBack: true,
    signal: "Trail running, vinyl, cooking for friends",
    bio: "Learning Italian, badly. Looking for someone to taste-test risotto.",
    answers: {
      sunday: "Early run, slow breakfast",
      trip: "The Dolomites",
      laugh: "Dogs who think they're tiny",
      value: "Kindness",
    },
  },
  {
    id: "lea",
    name: "Léa",
    age: 34,
    photo: lea,
    connectsBack: true,
    signal: "Bookshops, jazz bars, rowing",
    bio: "Translator. Fluent in three languages and sarcasm.",
    answers: {
      sunday: "Bookshop crawl",
      trip: "Kyoto in autumn",
      laugh: "Old sitcoms",
      value: "Honesty",
    },
  },
  {
    id: "sam",
    name: "Sam",
    age: 26,
    photo: sam,
    connectsBack: false,
    signal: "Board games, synths, houseplants",
    bio: "Sound designer. My plants have names and opinions.",
    answers: {
      sunday: "Game night with friends",
      trip: "Iceland",
      laugh: "Absurd memes",
      value: "Playfulness",
    },
  },
];

export const PROMPTS = [
  {
    id: "sunday",
    q: "What does your ideal Sunday look like?",
    options: [
      "Slow morning, no plans",
      "Outdoors all day",
      "Friends and food",
      "Catching up on reading",
    ],
  },
  {
    id: "trip",
    q: "Where would you go on a spontaneous trip?",
    options: ["Somewhere by the sea", "A big city", "The mountains", "Wherever the train goes"],
  },
  {
    id: "laugh",
    q: "What always makes you laugh?",
    options: ["Dry humour", "Silly animals", "My friends", "Good satire"],
  },
  {
    id: "value",
    q: "What do you value most in someone?",
    options: ["Kindness", "Curiosity", "Honesty", "Humour"],
  },
];

export const getDemoProfile = (id: string) => DEMO_PROFILES.find((p) => p.id === id);

export type ChatMessage = { from: "me" | "them"; text: string; at: number };
export type ConnectionState = {
  level: number;
  answered: { promptId: string; mine: string }[];
  mutual: boolean;
  ended?: boolean;
};

/** Seeded starting state: one session in progress, one mutual chat. */
export function seedConnections(): Record<string, ConnectionState> {
  return {
    maya: {
      level: 50,
      answered: [
        { promptId: "sunday", mine: "Slow morning, no plans" },
        { promptId: "trip", mine: "Somewhere by the sea" },
      ],
      mutual: false,
    },
    jonas: {
      level: 100,
      answered: PROMPTS.map((p) => ({ promptId: p.id, mine: p.options[0] ?? "" })),
      mutual: true,
    },
  };
}

export function seedMessages(): Record<string, ChatMessage[]> {
  const now = Date.now();
  return {
    jonas: [
      {
        from: "them",
        text: "Okay, the Dolomites answer — have you been?",
        at: now - 1000 * 60 * 60 * 5,
      },
      { from: "me", text: "Not yet! It's top of my list though.", at: now - 1000 * 60 * 60 * 4 },
      {
        from: "them",
        text: "Fair warning, I will talk about hiking routes for hours 😄",
        at: now - 1000 * 60 * 30,
      },
    ],
  };
}

export const DEMO_REPLIES = [
  "Ha, I like that.",
  "Tell me more!",
  "That's a good one.",
  "Same here, honestly.",
];
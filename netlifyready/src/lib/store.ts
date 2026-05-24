import { useSyncExternalStore } from "react";

export type ID = string;

export interface Project {
  id: ID;
  name: string;
  domain: string;
  description: string;
  country: string;
  status: "Active" | "Paused";
  initials: string;
}
export interface Keyword {
  id: ID;
  keyword: string;
  url: string;
  projectId: ID;
  position: number;
  volume: number;
  difficulty: number;
}
export interface Audit {
  id: ID;
  projectId: ID;
  url: string;
  score: number;
  issues: number;
  date: string;
}
export interface Backlink {
  id: ID;
  source: string;
  target: string;
  anchor: string;
  authority: number;
  type: "dofollow" | "nofollow";
}
export interface Competitor {
  id: ID;
  name: string;
  domain: string;
  overlap: number;
  keywords: number;
}
export interface Task {
  id: ID;
  title: string;
  assignee: string;
  due: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
}
export interface Campaign {
  id: ID;
  name: string;
  project: string;
  platform: "Google Ads" | "Meta" | "LinkedIn" | "TikTok";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: "Active" | "Paused";
}
export interface ReportItem {
  id: ID;
  title: string;
  type: "SEO" | "Ads" | "Backlinks" | "Traffic";
  date: string;
  author: string;
}
export interface UserRow {
  id: ID;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
}
export interface Settings {
  brand: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar?: string;
  timezone: string;
  currency: string;
}

export interface AppState {
  projects: Project[];
  keywords: Keyword[];
  audits: Audit[];
  backlinks: Backlink[];
  competitors: Competitor[];
  tasks: Task[];
  campaigns: Campaign[];
  reports: ReportItem[];
  users: UserRow[];
  settings: Settings;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const seed: AppState = {
  projects: [
    { id: uid(), name: "91Club ad", domain: "91clublogin.online", description: "Welcome to 91 Club Game. Login or Register Now and Play various games.", country: "IN", status: "Active", initials: "91" },
    { id: uid(), name: "91Club Games", domain: "91clublogin.online", description: "Join the 91Club today and start your journey from here you can earn a lot.", country: "IN", status: "Active", initials: "91" },
    { id: uid(), name: "91Club Game", domain: "91clublogin.online", description: "Daily missions, jackpots and rewards in 91Club Game.", country: "IN", status: "Active", initials: "91" },
    { id: uid(), name: "RankPilot Blog", domain: "blog.rankpilot.io", description: "SEO insights, tips and case studies from the RankPilot team.", country: "US", status: "Active", initials: "RP" },
    { id: uid(), name: "RankPilot App", domain: "app.rankpilot.io", description: "Main product surface for RankPilot customers.", country: "US", status: "Paused", initials: "RP" },
  ],
  keywords: [],
  audits: [],
  backlinks: [],
  competitors: [],
  tasks: [],
  campaigns: [],
  reports: [],
  users: [],
  settings: {
    brand: "RankPilot",
    ownerName: "Baku",
    ownerEmail: "admin@rankpilot.io",
    ownerAvatar: "public/b1.jpg",
    timezone: "UTC",
    currency: "USD",
  },
};

// Seed dependents using seed.projects ids
(() => {
  const [p1, p2, p3, p4] = seed.projects;
  const kws = [
    "91Club Official", "91Club game download", "91Club game", "91club wingo Hack",
    "91club support", "91Club for begginers", "91Club earning tips", "91club login and register",
    "91Club Free 100% working hack", "91club online", "91club game tips", "91club near me",
    "91club free bonuses", "rank tracker seo", "best seo tool", "backlink checker", "site audit tool",
  ];
  seed.keywords = kws.map((k, i) => ({
    id: uid(),
    keyword: k,
    url: i < 13 ? "https://91clublogin.online/" : "https://app.rankpilot.io/",
    projectId: ((i < 13 ? [p2, p3, p3, p3, p1, p3, p3, p3, p3, p3, p3, p3, p3][i] : p4) || p1).id,
    position: 1 + Math.floor(Math.random() * 50),
    volume: 100 + Math.floor(Math.random() * 9000),
    difficulty: Math.floor(Math.random() * 100),
  }));
  seed.audits = seed.projects.slice(0, 2).map((p) => ({
    id: uid(), projectId: p.id, url: `https://${p.domain}/`, score: 70 + Math.floor(Math.random() * 25), issues: Math.floor(Math.random() * 40), date: "2026-05-20",
  }));
  seed.backlinks = [
    { id: uid(), source: "techcrunch.com/article", target: "rankpilot.io", anchor: "rank tracking", authority: 92, type: "dofollow" },
    { id: uid(), source: "moz.com/blog", target: "rankpilot.io", anchor: "seo platform", authority: 88, type: "dofollow" },
    { id: uid(), source: "reddit.com/r/seo", target: "rankpilot.io", anchor: "click here", authority: 90, type: "nofollow" },
  ];
  seed.competitors = [
    { id: uid(), name: "Ahrefs", domain: "ahrefs.com", overlap: 42, keywords: 1820 },
    { id: uid(), name: "Semrush", domain: "semrush.com", overlap: 51, keywords: 2105 },
    { id: uid(), name: "Moz", domain: "moz.com", overlap: 33, keywords: 1240 },
  ];
  seed.tasks = [
    { id: uid(), title: "Fix broken links on /pricing", assignee: "Admin", due: "2026-05-30", priority: "High", status: "In Progress" },
    { id: uid(), title: "Publish backlink outreach round 3", assignee: "Sara", due: "2026-06-02", priority: "Medium", status: "Todo" },
    { id: uid(), title: "Audit 91Club landing page", assignee: "Ravi", due: "2026-05-28", priority: "High", status: "Todo" },
  ];
  seed.campaigns = [
    { id: uid(), name: "91Club game", project: "91Club Game", platform: "Google Ads", budget: 15000, spent: 8466, impressions: 847395, clicks: 39686, conversions: 1640, status: "Active" },
    { id: uid(), name: "91Club Login", project: "91Club Game", platform: "Google Ads", budget: 15000, spent: 9614, impressions: 983219, clicks: 43915, conversions: 1780, status: "Active" },
    { id: uid(), name: "91Club Login", project: "91Club ad", platform: "Google Ads", budget: 924, spent: 784, impressions: 93561, clicks: 4982, conversions: 240, status: "Paused" },
  ];
  seed.reports = [
    { id: uid(), title: "Weekly SEO Snapshot", type: "SEO", date: "2026-05-20", author: "Admin" },
    { id: uid(), title: "Ads Performance — May", type: "Ads", date: "2026-05-19", author: "Admin" },
  ];
  seed.users = [
    { id: uid(), name: "Admin", email: "admin@rankpilot.io", role: "Admin", status: "Active" },
    { id: uid(), name: "Sara Lee", email: "sara@rankpilot.io", role: "Editor", status: "Active" },
    { id: uid(), name: "Ravi K", email: "ravi@rankpilot.io", role: "Viewer", status: "Invited" },
  ];
})();

const KEY = "rankpilot:v1";

function load(): AppState {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    return { ...seed, ...JSON.parse(raw) };
  } catch {
    return seed;
  }
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function setState(updater: (s: AppState) => AppState) {
  state = updater(state);
  persist();
}

export function getState() {
  return state;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(seed),
  );
}

export const newId = uid;

// CRUD helpers
type Key = "projects" | "keywords" | "audits" | "backlinks" | "competitors" | "tasks" | "campaigns" | "reports" | "users";

export function addItem<K extends Key>(key: K, item: AppState[K][number]) {
  setState((s) => ({ ...s, [key]: [item, ...(s[key] as any[])] } as AppState));
}
export function updateItem<K extends Key>(key: K, id: ID, patch: Partial<AppState[K][number]>) {
  setState((s) => ({ ...s, [key]: (s[key] as any[]).map((x) => (x.id === id ? { ...x, ...patch } : x)) } as AppState));
}
export function removeItem<K extends Key>(key: K, id: ID) {
  setState((s) => ({ ...s, [key]: (s[key] as any[]).filter((x) => x.id !== id) } as AppState));
}
export function updateSettings(patch: Partial<Settings>) {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}
export function resetAll() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  state = load();
  listeners.forEach((l) => l());
}
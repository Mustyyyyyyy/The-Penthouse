export type ApartmentLite = {
  _id: string;
  title: string;
  location: string;
  price: number;
  rooms: number;
  images?: string[];
  available?: boolean;
  description?: string;
};

const SAVED_KEY = "savedApartments";
const RECENT_KEY = "recentApartments";

function read(key: string): ApartmentLite[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(key: string, data: ApartmentLite[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getSaved(): ApartmentLite[] {
  return read(SAVED_KEY);
}

export function isSaved(id: string) {
  return getSaved().some((a) => a._id === id);
}

export function toggleSaved(apt: ApartmentLite) {
  const current = getSaved();
  const exists = current.some((a) => a._id === apt._id);
  const next = exists ? current.filter((a) => a._id !== apt._id) : [apt, ...current];
  write(SAVED_KEY, next);
  return !exists; 
}

export function getRecent(): ApartmentLite[] {
  return read(RECENT_KEY);
}

export function pushRecent(apt: ApartmentLite) {
  const current = getRecent().filter((a) => a._id !== apt._id);
  const next = [apt, ...current].slice(0, 8);
  write(RECENT_KEY, next);
}
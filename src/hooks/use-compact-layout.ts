"use client";
import { useSyncExternalStore } from "react";
const query = "(max-width: 767px)";
function subscribe(onChange: () => void) {
  const media = matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const snapshot = () => matchMedia(query).matches;
const serverSnapshot = () => false;
export function useCompactLayout() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

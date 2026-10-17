export type BibiReactionType = "play" | "exit" | "success" | "error" | "click";

export const triggerBibiReaction = (reaction: BibiReactionType) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("bibi-react", { detail: reaction }));
  }
};

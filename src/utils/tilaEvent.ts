export type TilaReactionType = "play" | "exit" | "success" | "error" | "click";

export const triggerTilaReaction = (reaction: TilaReactionType) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tila-react", { detail: reaction }));
    window.dispatchEvent(new CustomEvent("bibi-react", { detail: reaction }));
  }
};

// Aliases for compatibility
export type BibiReactionType = TilaReactionType;
export const triggerBibiReaction = triggerTilaReaction;

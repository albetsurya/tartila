export type TitoReactionType = "play" | "exit" | "success" | "error" | "click";
export type TilaReactionType = TitoReactionType;
export type BibiReactionType = TitoReactionType;

export const triggerTitoReaction = (reaction: TitoReactionType) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tito-react", { detail: reaction }));
    window.dispatchEvent(new CustomEvent("tila-react", { detail: reaction }));
    window.dispatchEvent(new CustomEvent("bibi-react", { detail: reaction }));
  }
};

export const triggerTilaReaction = triggerTitoReaction;
export const triggerBibiReaction = triggerTitoReaction;

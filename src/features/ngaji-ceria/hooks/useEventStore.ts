import { create } from "zustand";
import {
  eventApi,
  type ActiveEventResponse,
  type ClaimEventRewardResponse,
  type EventInfo,
  type EventMission,
} from "../services/eventApi";
import {
  notifyActiveEvent,
  notifyEventReward,
} from "../services/eventNotificationService";

export interface ActiveEvent extends EventInfo {
  missions: EventMission[];
}

interface EventState {
  activeEvent: ActiveEvent | null;
  isLoading: boolean;
  error: string | null;
  fetchActiveEvents: () => Promise<void>;
  updateProgress: (actionType: string, amount?: number) => Promise<void>;
  claimReward: (missionId: string) => Promise<ClaimEventRewardResponse>;
}

function toActiveEvent(payload: ActiveEventResponse | null): ActiveEvent | null {
  if (!payload?.event) return null;
  return {
    ...payload.event,
    missions: payload.missions ?? [],
  };
}

function errorMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "Gagal memuat event. Silakan coba lagi.";
}

export const useEventStore = create<EventState>((set, get) => ({
  activeEvent: null,
  isLoading: false,
  error: null,

  fetchActiveEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const payload = await eventApi.getActive();
      const activeEvent = toActiveEvent(payload);
      set({ activeEvent, isLoading: false });

      if (activeEvent) {
        notifyActiveEvent(activeEvent);
      }
    } catch (err) {
      set({ isLoading: false, error: errorMessage(err) });
    }
  },

  // Optimistic UI: progres lokal langsung naik, lalu disinkronkan dengan
  // progres otoritatif dari Backend Go.
  updateProgress: async (actionType, amount = 1) => {
    const current = get().activeEvent;
    if (!current) return;

    set({
      activeEvent: {
        ...current,
        missions: current.missions.map((mission) =>
          mission.action_type === actionType
            ? {
                ...mission,
                progress: mission.progress + amount,
                is_completed:
                  mission.progress + amount >= mission.target_amount,
              }
            : mission,
        ),
      },
    });

    try {
      const payload = await eventApi.addProgress(actionType, amount);
      const activeEvent = toActiveEvent(payload);
      set({ activeEvent, error: null });
      if (activeEvent) {
        notifyActiveEvent(activeEvent);
      }
    } catch {
      // Kembalikan ke progres server bila penulisan gagal.
      await get().fetchActiveEvents();
    }
  },

  claimReward: async (missionId) => {
    const mission = get().activeEvent?.missions.find(
      (item) => item.id === missionId,
    );
    if (!mission) {
      throw new Error("Misi tidak ditemukan");
    }

    const result = await eventApi.claimReward(missionId);

    set((state) => ({
      activeEvent: state.activeEvent
        ? {
            ...state.activeEvent,
            missions: state.activeEvent.missions.map((item) =>
              item.id === missionId ? { ...item, is_claimed: true } : item,
            ),
          }
        : null,
    }));

    notifyEventReward(mission, result);
    return result;
  },
}));

import { callREST } from "../../../services/api";

export interface EventInfo {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface EventMission {
  id: string;
  event_id: string;
  title: string;
  action_type: string;
  target_amount: number;
  reward_coins: number;
  reward_tickets: number;
  reward_hearts: number;
  progress: number;
  is_claimed: boolean;
  is_completed: boolean;
}

export interface ActiveEventResponse {
  event: EventInfo | null;
  missions: EventMission[];
}

export interface ClaimEventRewardResponse {
  mission_id: string;
  claimed: boolean;
  coins: number;
  tickets: number;
  hearts: number;
  reward: {
    coins: number;
    tickets: number;
    hearts: number;
  };
}

export const eventApi = {
  getActive: () =>
    callREST<ActiveEventResponse>("GET", "/api/v1/events/active"),
  addProgress: (actionType: string, amount = 1) =>
    callREST<ActiveEventResponse>("POST", "/api/v1/events/progress", {
      action_type: actionType,
      amount,
    }),
  claimReward: (missionId: string) =>
    callREST<ClaimEventRewardResponse>(
      "POST",
      `/api/v1/events/${encodeURIComponent(missionId)}/claim`,
    ),
};

import { arenaApi, fetchWsTicket } from "./arenaApi";
import type { ClientQuestionPayload } from "../data/quiz/types";
import {
  formatQuestionsForWebSocket,
  type WebSocketQuestionPayload,
} from "../data/TilawatiDataProvider";

export interface ArenaSocketCallbacks {
  onRoomState?: (state: any) => void;
  onPlayerJoined?: (data: { player: any; totalPlayers: number }) => void;
  onGameStarted?: (data: { question: ClientQuestionPayload; questionIndex: number; totalQuestions: number; timeLimit: number }) => void;
  onPlayerAnswered?: (data: { playerId: string; answeredCount: number; totalPlayers: number }) => void;
  onAnswerAcknowledged?: (data: { isCorrect: boolean; scoreAwarded: number; totalScore: number }) => void;
  onQuestionResult?: (data: { questionId: string; correctAnswer: string; explanation?: string; leaderboard: any[] }) => void;
  onShowLeaderboard?: (data: { leaderboard: any[] }) => void;
  onNextQuestion?: (data: { question: ClientQuestionPayload; questionIndex: number; totalQuestions: number; timeLimit: number }) => void;
  onGameFinished?: (data: { leaderboard: any[]; kkm?: number; winnerId?: string; outcome?: string; isDraw?: boolean }) => void;
  onViolationWarning?: (data: { violations: number; maxViolations: number; autoSubmitted: boolean; message: string }) => void;
  onPlayerViolation?: (data: { playerId: string; nickname: string; violations: number; autoSubmitted: boolean }) => void;
  onHostDisconnected?: (data: { message?: string }) => void;
  onRoomReset?: (data: { status: string }) => void;
  onReconnect?: () => void;
  onError?: (err: string) => void;
  onClose?: () => void;
}

export class ArenaSocket {
  private ws: WebSocket | null = null;
  private pin: string;
  private playerId?: string;
  private isHost: boolean;
  private callbacks: ArenaSocketCallbacks;
  private shouldReconnect: boolean = true;
  private reconnectTimer?: number;
  private heartbeatTimer?: number;
  private reconnectAttempts: number = 0;
  private readonly maxReconnectDelayMs: number = 5000;
  private lastTicket: string = "";
  private lastTicketAt = 0;
  private visibilityListenerAttached: boolean = false;
  private opening: boolean = false;

  constructor(pin: string, playerId?: string, isHost: boolean = false, callbacks: ArenaSocketCallbacks = {}) {
    this.pin = pin;
    this.playerId = playerId;
    this.isHost = isHost;
    this.callbacks = callbacks;
    this.setupResumeListeners();
  }

  connect(): void {
    void this.open();
  }

  private async open(): Promise<void> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    if (this.opening) return;
    this.opening = true;

    let ticket = this.lastTicket;
    const now = Date.now();
    if (!ticket || Date.now() - this.lastTicketAt >= 60000) {
      try {
        ticket = await fetchWsTicket();
      } finally {
        this.opening = false;
      }
    }
    this.lastTicket = ticket;
    this.lastTicketAt = Date.now();

    if (!this.shouldReconnect) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const url = arenaApi.getWsUrl(this.pin, this.playerId, this.isHost, ticket);
    try {
      this.ws = new WebSocket(url);
    } catch {
      this.callbacks.onError?.("Gagal membuka koneksi WebSocket");
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      if (this.reconnectTimer) {
        window.clearTimeout(this.reconnectTimer);
        this.reconnectTimer = undefined;
      }
      this.startHeartbeat();
      this.callbacks.onReconnect?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const rawData = typeof event.data === "string" ? event.data : "";
        if (!rawData) return;
        try {
          // Parse as single complete JSON object
          const msg = JSON.parse(rawData);
          this.handleMessage(msg);
        } catch {
          // Fallback for line-delimited batches
          const lines = rawData.split("\n").filter((l) => l.trim().length > 0);
          for (const line of lines) {
            const msg = JSON.parse(line);
            this.handleMessage(msg);
          }
        }
      } catch (e) {
        console.error("[ArenaSocket] JSON error", e);
      }
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.callbacks.onClose?.();
      if (this.shouldReconnect) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      this.callbacks.onError?.("Koneksi arena terganggu");
    };
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
    }
    // Exponential backoff: 1s, 1.5s, 2.25s, max 5s
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), this.maxReconnectDelayMs);
    this.reconnectAttempts++;
    if (this.reconnectAttempts > 4) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    // Heartbeat every 15s to keep connection alive during background tab / power saving
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send("ping", { t: Date.now() });
      }
    }, 15000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private setupResumeListeners(): void {
    if (this.visibilityListenerAttached || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    this.visibilityListenerAttached = true;

    const handleResume = () => {
      if (!this.shouldReconnect) return;
      // When tab becomes active again or window is focused
      if (!document.hidden) {
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
          console.log("[ArenaSocket] Tab visible & socket disconnected. Reconnecting immediately...");
          if (this.reconnectTimer) {
            window.clearTimeout(this.reconnectTimer);
            this.reconnectTimer = undefined;
          }
          this.connect();
        } else if (this.ws.readyState === WebSocket.OPEN) {
          // Immediately ping to ensure pipe is fresh
          this.send("ping", { t: Date.now() });
        }
      }
    };

    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleResume);
    window.addEventListener("online", handleResume);
  }

  private handleMessage(msg: { type: string; payload: any }): void {
    switch (msg.type) {
      case "pong":
        // Server heartbeat response
        break;
      case "room_state":
      case "room.snapshot":
        this.callbacks.onRoomState?.(msg.payload);
        break;
      case "player_joined":
      case "room.participant_joined":
        this.callbacks.onPlayerJoined?.(msg.payload);
        break;
      case "game_started":
      case "question.started":
        this.callbacks.onGameStarted?.(msg.payload);
        break;
      case "player_answered":
      case "answer.progress_updated":
        this.callbacks.onPlayerAnswered?.(msg.payload);
        break;
      case "answer_acknowledged":
      case "answer.acknowledged":
        this.callbacks.onAnswerAcknowledged?.(msg.payload);
        break;
      case "question_result":
      case "answer.revealed":
        this.callbacks.onQuestionResult?.(msg.payload);
        break;
      case "show_leaderboard":
        this.callbacks.onShowLeaderboard?.(msg.payload);
        break;
      case "next_question":
        this.callbacks.onNextQuestion?.(msg.payload);
        break;
      case "game_finished":
      case "match.finished":
        this.callbacks.onGameFinished?.(msg.payload);
        break;
      case "host_disconnected":
        this.callbacks.onHostDisconnected?.(msg.payload);
        break;
      case "room_reset":
      case "room.reset_to_lobby":
        this.callbacks.onRoomReset?.(msg.payload);
        break;
      case "violation_warning":
        this.callbacks.onViolationWarning?.(msg.payload);
        break;
      case "player_violation":
        this.callbacks.onPlayerViolation?.(msg.payload);
        break;
      case "error":
        this.callbacks.onError?.(typeof msg.payload === "string" ? msg.payload : msg.payload?.message || "Terjadi kesalahan");
        break;
    }
  }

  startGame(questions?: WebSocketQuestionPayload[] | any[]): void {
    this.send("start_game", questions ? { questions } : {});
  }

  sendQuestions(jilid: number = 1, limit: number = 10): WebSocketQuestionPayload[] {
    const questions = formatQuestionsForWebSocket(jilid, limit);
    this.send("load_questions", { questions });
    return questions;
  }

  submitAnswer(questionId: string, answer: string): void {
    this.send("submit_answer", { questionId, answer });
  }

  revealAnswer(): void {
    this.send("reveal_answer", {});
  }

  showLeaderboard(): void {
    this.send("show_leaderboard", {});
  }

  nextQuestion(): void {
    this.send("next_question", {});
  }

  sendHostLeft(): void {
    this.send("host_left", {});
  }

  resetRoom(): void {
    this.send("reset_room", {});
  }

  recordViolation(): void {
    this.send("record_violation", { type: "tab_switch" });
  }

  private send(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

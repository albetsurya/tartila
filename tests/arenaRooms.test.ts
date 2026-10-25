import assert from "node:assert/strict";
import { arenaRoomService } from "../src/services/arenaRoomService";
import { normalizeJoinCode } from "../src/lib/joinCode";

// Mock localStorage untuk testing
const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (k: string) => storage[k] ?? null,
  setItem: (k: string, v: string) => {
    storage[k] = String(v);
  },
  removeItem: (k: string) => {
    delete storage[k];
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  },
};

(globalThis as any).window = {
  localStorage: mockLocalStorage,
  sessionStorage: mockLocalStorage,
};

export const tests = {
  "arenaRoomService: generateRoomCode menghasilkan 6 karakter unik": () => {
    const code = arenaRoomService.generateRoomCode();
    assert.equal(code.length, 6);
    assert.equal(normalizeJoinCode(code), code);
    assert.match(code, /^[A-Z0-9]{6}$/);
  },

  "arenaRoomService: member membuat room bertipe 'casual'": async () => {
    mockLocalStorage.clear();
    const room = await arenaRoomService.createRoom({
      hostId: "member-123",
      hostName: "Ahmad Santri",
      roomType: "casual",
      title: "Kuis Tilawati Ceria",
    });

    assert.ok(room.id);
    assert.equal(room.room_type, "casual");
    assert.equal(room.status, "waiting");
    assert.equal(room.room_code.length, 6);
    assert.equal(room.host_id, "member-123");

    // Host otomatis terdaftar di room_players
    const players = await arenaRoomService.getRoomPlayers(room.id);
    assert.equal(players.length, 1);
    assert.equal(players[0].nickname, "Ahmad Santri");
    assert.equal(players[0].is_host, true);
  },

  "arenaRoomService: ustadz membuat room bertipe 'exam' dengan KKM": async () => {
    const room = await arenaRoomService.createRoom({
      hostId: "ustadz-456",
      hostName: "Ustadz Abdullah",
      roomType: "exam",
      kkm: 80,
    });

    assert.ok(room.id);
    assert.equal(room.room_type, "exam");
    assert.equal(room.status, "waiting");
    assert.equal(room.kkm, 80);
    assert.equal(room.host_id, "ustadz-456");
  },

  "arenaRoomService: getRoom menemukan room berdasarkan PIN": async () => {
    const room = await arenaRoomService.createRoom({
      hostId: "user-789",
      hostName: "Fatimah",
      roomType: "casual",
    });

    const found = await arenaRoomService.getRoom(room.pin);
    assert.ok(found);
    assert.equal(found?.id, room.id);
    assert.equal(found?.room_code, room.pin);
  },

  "arenaRoomService: pemain lain bergabung ke room 'waiting'": async () => {
    const room = await arenaRoomService.createRoom({
      hostId: "host-1",
      hostName: "Host Ahmad",
      roomType: "casual",
    });

    const joinRes = await arenaRoomService.joinRoom(room.pin, "Ali", "ali-user");
    assert.equal(joinRes.success, true);
    assert.equal(joinRes.player.nickname, "Ali");
    assert.equal(joinRes.player.room_id, room.id);

    const players = await arenaRoomService.getRoomPlayers(room.id);
    assert.equal(players.length, 2);
    assert.ok(players.some((p) => p.nickname === "Ali"));
  },

  "arenaRoomService: startGame mengubah status room dan menolak pemain baru": async () => {
    const room = await arenaRoomService.createRoom({
      hostId: "host-lock",
      hostName: "Host Zaid",
      roomType: "casual",
    });

    await arenaRoomService.startGame(room.id, room.pin);
    const updated = await arenaRoomService.getRoom(room.pin);
    assert.equal(updated?.status, "playing");

    // Pemain lain yang mencoba join ke room 'playing' ditolak
    await assert.rejects(
      async () => {
        await arenaRoomService.joinRoom(room.pin, "Late Player");
      },
      {
        message: "Room ini sudah memulai permainan atau sudah selesai.",
      }
    );
  },
};

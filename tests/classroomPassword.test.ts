import assert from 'node:assert/strict';
import { supabase } from '@/lib/supabase';
import {
  setRoomPassword,
  verifyRoomPassword,
} from '../src/services/classroomService.ts';

type RpcResult = { data: unknown; error: unknown };

/** Ganti `supabase.rpc` sementara; kembalikan supaya tak bocor ke test lain. */
function stubRpc(results: Record<string, RpcResult>) {
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  const original = (supabase as unknown as { rpc: unknown }).rpc;
  (supabase as unknown as { rpc: unknown }).rpc = (
    name: string,
    args: Record<string, unknown>,
  ) => {
    calls.push({ name, args });
    return Promise.resolve(results[name] ?? { data: null, error: null });
  };
  return {
    calls,
    restore: () => {
      (supabase as unknown as { rpc: unknown }).rpc = original;
    },
  };
}

async function withStub<T>(
  results: Record<string, RpcResult>,
  run: (stub: ReturnType<typeof stubRpc>) => Promise<T>,
) {
  const stub = stubRpc(results);
  try {
    return await run(stub);
  } finally {
    stub.restore();
  }
}

export const tests = {
  'verifyRoomPassword: password benar di database menghasilkan true': async () => {
    await withStub(
      { verify_room_password: { data: true, error: null } },
      async (stub) => {
        const allowed = await verifyRoomPassword('ABC12345', 'rahasia123');
        assert.equal(allowed, true);
        assert.deepEqual(stub.calls, [
          {
            name: 'verify_room_password',
            args: { p_join_code: 'ABC12345', p_password: 'rahasia123' },
          },
        ]);
      },
    );
  },

  'verifyRoomPassword: database menolak menghasilkan false': async () => {
    await withStub(
      { verify_room_password: { data: false, error: null } },
      async () => {
        assert.equal(await verifyRoomPassword('ABC12345', 'salah'), false);
      },
    );
  },

  'verifyRoomPassword: kegagalan jaringan menghasilkan false, bukan true': async () => {
    await withStub(
      { verify_room_password: { data: null, error: { message: 'timeout' } } },
      async () => {
        assert.equal(await verifyRoomPassword('ABC12345', 'rahasia123'), false);
      },
    );
  },

  'verifyRoomPassword: hasil null dianggap false': async () => {
    await withStub(
      { verify_room_password: { data: null, error: null } },
      async () => {
        assert.equal(await verifyRoomPassword('ABC12345', 'rahasia123'), false);
      },
    );
  },

  'setRoomPassword: tidak pernah mengirim hash dari browser': async () => {
    await withStub({ set_room_password: { data: null, error: null } }, async (stub) => {
      const ok = await setRoomPassword('room-uuid', 'rahasia123');
      assert.equal(ok, true);
      // Password dikirim apa adanya; hashing bcrypt terjadi di database.
      assert.deepEqual(stub.calls, [
        {
          name: 'set_room_password',
          args: { p_room_id: 'room-uuid', p_password: 'rahasia123' },
        },
      ]);
    });
  },

  'setRoomPassword: kegagalan RPC dikembalikan sebagai false': async () => {
    await withStub(
      { set_room_password: { data: null, error: { message: 'denied' } } },
      async () => {
        assert.equal(await setRoomPassword('room-uuid', 'rahasia123'), false);
      },
    );
  },
};

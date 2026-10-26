import { setToken, clearToken, callREST } from "./api";

export interface User {
  id?: string;
  user_id?: string;
  name: string;
  role?: string;
  member_id?: string;
  username?: string;
  photo_url?: string;
  gender?: string;
  group_id?: string;
}

function storeSessionToken(token?: string) {
  if (token) setToken(token);
  else clearToken();
}

export const authApi = {
  async login(identifier: string, password: string): Promise<User> {
    const cleanId = identifier.trim();
    const data = await callREST<{ token?: string; user: User }>(
      "POST",
      "/api/v1/auth/login",
      {
        username: cleanId,
        email: cleanId,
        identifier: cleanId,
        password,
      }
    );
    storeSessionToken(data.token);
    return data.user;
  },

  async loginWithGoogle(credential: string): Promise<User> {
    const data = await callREST<{ token?: string; user: User }>(
      "POST",
      "/api/v1/auth/oauth/google",
      { credential, intent: "ceria" }
    );
    storeSessionToken(data.token);
    return data.user;
  },

  // Kirim JWT Supabase ke Backend Go agar profil user (role default 'member')
  // di-upsert ke public.users (Bagian 8.3). Fire-and-forget dari pemanggil.
  async syncProfile(supabaseJwt: string): Promise<void> {
    await callREST(
      "POST",
      "/api/v1/auth/sync-profile",
      {},
      undefined,
      supabaseJwt
    );
  },

  async registerCeria(
    name: string,
    username: string,
    password: string,
    confirmPassword: string,
    referralCode?: string
  ): Promise<User> {
    const data = await callREST<{ token?: string; user: User }>(
      "POST",
      "/api/v1/auth/register/ceria",
      {
        name,
        username,
        password,
        confirm_password: confirmPassword,
        referral_code: referralCode ? referralCode.trim().toUpperCase() : undefined,
      }
    );
    storeSessionToken(data.token);
    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await callREST("POST", "/api/v1/auth/logout");
    } finally {
      clearToken();
    }
  },

  async validateSession(): Promise<User> {
    const data = await callREST<{ user: User }>(
      "GET",
      "/api/v1/auth/validate-session"
    );
    return data.user;
  },
};
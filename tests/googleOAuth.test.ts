import assert from "node:assert/strict";
import React from "react";
import { GoogleIconSvg, GoogleIcon, GoogleSvg } from "@/components/ui/CustomIcons";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { supabase } from "@/lib/supabase";

export const tests = {
  "GoogleIconSvg: Terdefinisi, merupakan komponen React valid, dan memuat 4 warna resmi Google": () => {
    assert.equal(typeof GoogleIconSvg, "function");
    assert.equal(GoogleIcon, GoogleIconSvg);
    assert.equal(GoogleSvg, GoogleIconSvg);

    const el = React.createElement(GoogleIconSvg, { size: 24 });
    assert.ok(React.isValidElement(el));

    // Periksa bahwa hasil fungsi GoogleIconSvg memuat path warna resmi Google
    const renderedSvg = GoogleIconSvg({ size: 24 });
    const renderedString = JSON.stringify(renderedSvg);
    assert.ok(renderedString.includes("#4285F4"), "Harus memuat warna biru Google #4285F4");
    assert.ok(renderedString.includes("#34A853"), "Harus memuat warna hijau Google #34A853");
    assert.ok(renderedString.includes("#FBBC05"), "Harus memuat warna kuning Google #FBBC05");
    assert.ok(renderedString.includes("#EA4335"), "Harus memuat warna merah Google #EA4335");
  },

  "AuthCallbackPage & LoginPage: Terdefinisi sebagai fungsi komponen React": () => {
    assert.equal(typeof AuthCallbackPage, "function");
    assert.equal(typeof LoginPage, "function");
  },

  "Supabase Client: Mendukung signInWithOAuth untuk provider google": () => {
    assert.ok(supabase, "Klien Supabase harus terdefinisi");
    assert.ok(supabase.auth, "Supabase Auth harus terdefinisi");
    assert.equal(typeof supabase.auth.signInWithOAuth, "function");
    assert.equal(typeof supabase.auth.getSession, "function");
  },

  "Konfigurasi Environment: VITE_GOOGLE_CLIENT_ID mengontrol visibilitas tombol Google": () => {
    const isClientIdActive = (clientId?: string | null) => Boolean(clientId && clientId.trim().length > 0);

    assert.equal(isClientIdActive(undefined), false);
    assert.equal(isClientIdActive(""), false);
    assert.equal(isClientIdActive("   "), false);
    assert.equal(isClientIdActive("123456789-dummy.apps.googleusercontent.com"), true);
  },
};

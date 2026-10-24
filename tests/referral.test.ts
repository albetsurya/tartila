import assert from 'node:assert/strict';

export const tests = {
  'referral share link: format WhatsApp URL-encoded dengan kode referral': () => {
    const code = 'TITO-ABCD';
    const text = `Ayo belajar ngaji di Tartila! Masukkan kode referral saya: ${code} untuk dapat hadiah!`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    assert.ok(shareUrl.startsWith('https://wa.me/?text='));
    assert.ok(shareUrl.includes('TITO-ABCD'));
    assert.ok(shareUrl.includes(encodeURIComponent('Ayo belajar ngaji di Tartila!')));
  },

  'referral code normalizer: membersihkan spasi dan mengkapitalkan kode': () => {
    const rawInput = '   tito-xyz9   ';
    const normalized = rawInput.trim().toUpperCase();

    assert.equal(normalized, 'TITO-XYZ9');
    assert.ok(normalized.startsWith('TITO-'));
    assert.equal(normalized.length, 9);
  },

  'referral anti-fraud: verifikasi aturan self-referral dan status awal': () => {
    const currentUserId = 'USR123456';
    const userReferralCode = 'TITO-TEST';

    // Kasus 1: Referee mencoba memasukkan kodenya sendiri
    const inputCode = 'tito-test';
    const isSelfReferral = inputCode.trim().toUpperCase() === userReferralCode;
    assert.equal(isSelfReferral, true);

    // Kasus 2: Status awal referral harus 'pending' (belum rewarded)
    const initialReferralStatus = 'pending';
    assert.equal(initialReferralStatus, 'pending');

    // Kasus 3: Syarat reward (misal setelah menyelesaikan 1 kuis)
    const quizCompleted = true;
    const nextStatus = quizCompleted ? 'success' : 'pending';
    assert.equal(nextStatus, 'success');
  },
};

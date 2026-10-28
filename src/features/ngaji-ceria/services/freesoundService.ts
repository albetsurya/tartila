/**
 * Wrapper sederhana untuk Freesound API v2.
 * Butuh environment variable: VITE_FREE_SOUND_API_KEY
 * Lihat README freesound.org untuk daftar sound CC0/CB-BY.
 */
export interface FreesoundSearchResult {
  id: number;
  name: string;
  preview_url: string | null;
  preview_plist: string[] | null;
  uri: string;
  username: string;
  permanent_url: string;
  perms: {
    share: string;
  };
}

export interface FreesoundSearchOptions {
  query: string;
  filter?: {
    min_duration?: number;
    max_duration?: number;
    tags?: string[];
  };
}

export class FreesoundService {
  private readonly apiBase = 'https://freesound.org/apiv2';
  private readonly apiKey: string;

  constructor() {
    // Ambil dari environment (Vite inject via VITE_FREE_SOUND_API_KEY)
    this.apiKey = import.meta.env.VITE_FREE_SOUND_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[Freesound] VITE_FREE_SOUND_API_KEY not set — fallback will fail');
    }
  }

  /**
   * Cari sound berdasarkan query.
   * Return daftar hasil (maksimal 5 untuk performa).
   */
  async search(options: FreesoundSearchOptions): Promise<FreesoundSearchResult[]> {
    if (!this.apiKey) return [];

    const params = new URLSearchParams({
      query: options.query,
      format: 'json',
      page: '1',
      limit: '5',
    });

    if (options.filter?.tags?.length) {
      params.append('tag', options.filter.tags.join(','));
    }
    if (options.filter?.min_duration !== undefined) {
      params.append('min_duration', String(options.filter.min_duration));
    }
    if (options.filter?.max_duration !== undefined) {
      params.append('max_duration', String(options.filter.max_duration));
    }

    try {
      const response = await fetch(`${this.apiBase}/search/text/?${params}`, {
        headers: {
          Authorization: `Token ${this.apiKey}`,
        },
      });

      if (!response.ok) throw new Error(`Freesound API ${response.status}`);

      const data = await response.json();
      return data.results || [];
    } catch (err) {
      console.error('[Freesound] Search error:', err);
      return [];
    }
  }

  /**
   * Cari sound CC0 (public domain) untuk kategori SFX umum.
   * Digunakan saat file lokal tidak ditemukan.
   */
  async findFallbackSfx(sfxName: string): Promise<{ url: string; name: string } | null> {
    // Mapping nama SFX yang kita butuhkan ke keyword search di Freesound
    const keywords: Record<string, string> = {
      tap: 'button click',
      pop: 'pop sound',
      correct: 'correct answer',
      wrong: 'wrong answer',
      streak: 'streak sound',
      powerup: 'power up',
      victory: 'victory fanfare',
      defeat: 'defeat sound',
      gameover: 'game over',
    };

    const query = keywords[sfxName] || sfxName;
    const results = await this.search({ query });

    if (!results.length) return null;

    // Pilih result pertama yang punya preview URL
    for (const result of results) {
      if (result.preview_url) {
        // Freesound preview biasanya format ogg/mp3 preview
        return {
          url: result.preview_url,
          name: result.name,
        };
      }
    }

    // Jika tidak ada preview, ambil URL permanent (butuh play dari sana)
    const first = results[0];
    return first.permanent_url ? { url: first.permanent_url, name: first.name } : null;
  }
}
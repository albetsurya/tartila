import type { PatternType } from '../utils/tilawatiTrainingDataAdapter';

/**
 * Map patternType ke deret panah yang harus disusun pemain.
 * Contoh:
 *   "3-datar-naik-turun" => ['datar', 'naik', 'turun']
 *   "2-datar-turun"      => ['datar', 'turun']
 */
export function patternTypeToArrows(patternType: string): string[] {
  const map: Record<string, string[]> = {
    '1-datar': ['datar'],
    '1-naik': ['naik'],
    '1-turun': ['turun'],
    '2-datar-turun': ['datar', 'turun'],
    '3-datar-naik-turun': ['datar', 'naik', 'turun'],
    '4-datar-naik-naik-turun': ['datar', 'naik', 'naik', 'turun'],
  };
  return map[patternType] ?? ['datar'];
}

export function derivePatternTypeFromHintTone(hintTone: string): string {
  const t = hintTone.toLowerCase();
  const naikCount = (t.match(/naik/g) || []).length;
  if (t.includes('datar') && naikCount >= 2 && t.includes('turun')) return '4-datar-naik-naik-turun';
  if (t.includes('datar') && t.includes('naik') && t.includes('turun')) return '3-datar-naik-turun';
  if (t.includes('datar') && t.includes('turun')) return '2-datar-turun';
  if (t.includes('naik')) return '1-naik';
  if (t.includes('turun')) return '1-turun';
  return '1-datar';
}

export type ArrowType = 'datar' | 'naik' | 'turun';

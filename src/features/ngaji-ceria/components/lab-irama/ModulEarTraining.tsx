import { useState, useEffect, useRef } from 'react';
import { getHeaderSamples, type PatternType } from '../../utils/tilawatiTrainingDataAdapter';
import { PatternArrow, type PatternArrowType } from './PatternArrow';
import { soundManager } from '../../services/soundManager';
import { getAudioUrl } from '../../utils/audioUrl';
import {
  PlaySvg,
  HeadphoneSvg,
  SparklesSvg,
  StarSvg,
  RotateCcwSvg,
} from '../../../../components/ui/CustomIcons';

interface ModulEarTrainingProps {
  onComplete?: () => void;
}

interface PatternQuestion {
  id: string;
  audioUrl: string;
  correctPattern: PatternArrowType;
}

const ARROW_PATTERN_TYPES: PatternArrowType[] = [
  '1-datar',
  '2-datar-turun',
  '3-datar-naik-turun',
  '4-datar-naik-naik-turun',
];

const PATTERN_LABELS: Record<PatternArrowType, string> = {
  '1-datar': '1 Nada',
  '2-datar-turun': '2 Nada',
  '3-datar-naik-turun': '3 Nada',
  '4-datar-naik-naik-turun': '4 Nada',
};

function isArrowPattern(value: PatternType): value is PatternArrowType {
  return ARROW_PATTERN_TYPES.includes(value as PatternArrowType);
}

function buildQuestions(): PatternQuestion[] {
  const jilidList = [1, 2, 3, 4, 5];
  const collected: PatternQuestion[] = [];
  const seenPattern = new Set<PatternArrowType>();

  for (const jilid of jilidList) {
    for (const item of getHeaderSamples(jilid)) {
      if (!isArrowPattern(item.patternType)) continue;
      if (seenPattern.has(item.patternType)) continue;

      seenPattern.add(item.patternType);
      collected.push({
        id: item.id,
        audioUrl: item.audioUrl,
        correctPattern: item.patternType,
      });
    }
  }

  if (collected.length >= 2) return collected;

  // Fallback sementara bila data adapter belum memuat audio.
  return [
    {
      id: 'fallback-1',
      audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_datar.ogg',
      correctPattern: '1-datar',
    },
    {
      id: 'fallback-3',
      audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_full.ogg',
      correctPattern: '3-datar-naik-turun',
    },
  ];
}

export const ModulEarTraining = ({ onComplete }: ModulEarTrainingProps) => {
  const [questions] = useState<PatternQuestion[]>(() => buildQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<PatternArrowType | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const currentQ: PatternQuestion | undefined = questions[currentIndex];

  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const playQuestionAudio = () => {
    stopAudio();

    if (!currentQ?.audioUrl) return;

    const resolvedUrl = getAudioUrl(currentQ.audioUrl) ?? currentQ.audioUrl;
    const audio = new Audio(resolvedUrl);
    audioRef.current = audio;

    audio.onended = () => {
      if (audioRef.current === audio) setIsPlayingAudio(false);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) setIsPlayingAudio(false);
    };

    audio
      .play()
      .then(() => setIsPlayingAudio(true))
      .catch(() => setIsPlayingAudio(false));
  };

  useEffect(() => {
    if (isFinished || !currentQ) return;

    setSelectedPattern(null);
    setAnswerStatus('idle');
    playQuestionAudio();

    return stopAudio;
  }, [currentIndex, isFinished]);

  useEffect(() => {
    return () => {
      clearFeedbackTimer();
      stopAudio();
    };
  }, []);

  const handleSelectPattern = (type: PatternArrowType) => {
    if (!currentQ || selectedPattern || isFinished) return;

    soundManager.playSfx('tap');
    setSelectedPattern(type);

    if (type === currentQ.correctPattern) {
      soundManager.playSfx('correct');
      setAnswerStatus('correct');
      setScore((prev) => prev + 20);
      setCorrectCount((prev) => prev + 1);

      feedbackTimerRef.current = window.setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsFinished(true);
          onComplete?.();
        }
      }, 1000);

      return;
    }

    soundManager.playSfx('wrong');
    setAnswerStatus('wrong');

    feedbackTimerRef.current = window.setTimeout(() => {
      setSelectedPattern(null);
      setAnswerStatus('idle');
    }, 800);
  };

  const handleRestart = () => {
    clearFeedbackTimer();
    stopAudio();
    setScore(0);
    setCorrectCount(0);
    setCurrentIndex(0);
    setSelectedPattern(null);
    setAnswerStatus('idle');
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4 rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
        <div className="text-center space-y-2">
          <div className="inline-flex rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-2 shadow-[3px_3px_0px_#134E4A]">
            <SparklesSvg size={32} />
          </div>
          <h2 className="text-xl font-black text-[#134E4A]">Sesi Selesai</h2>
          <p className="text-sm font-bold text-[#134E4A]/70">
            Skor: <span className="text-[#0D9488]">{score}</span> · Benar:{' '}
            <span className="text-[#0D9488]">{correctCount}</span>/{questions.length}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="w-full py-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcwSvg size={18} /> Main Lagi
        </button>
      </div>
    );
  }

  if (!currentQ) return null;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-[#134E4A]">
          Soal {currentIndex + 1}/{questions.length}
        </span>
        <span className="flex items-center gap-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-xs font-black text-[#134E4A]">
          <StarSvg size={14} fill="#FDE047" stroke="#134E4A" /> {score}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full border-2 border-[#134E4A] bg-white">
        <div className="h-full bg-[#0D9488]" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="space-y-3 rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 text-center shadow-[4px_4px_0px_#134E4A]">
        <span className="inline-block rounded-full bg-[#0D9488]/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0D9488]">
          Tebak Pola Nada
        </span>

        <p className="text-sm font-bold text-[#134E4A]/70">
          Dengarkan audio qari, lalu pilih pola irama yang tepat.
        </p>

        <button
          type="button"
          onClick={playQuestionAudio}
          className="w-full py-3 rounded-2xl border-2 border-[#134E4A] bg-white font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2"
        >
          {isPlayingAudio ? (
            <HeadphoneSvg size={16} />
          ) : (
            <PlaySvg size={16} />
          )}
          {isPlayingAudio ? 'Memutar Audio Qari...' : 'Putar Audio Qari'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ARROW_PATTERN_TYPES.map((type) => {
          const isSelected = selectedPattern === type;
          const isCorrectAnswer = currentQ.correctPattern === type;
          const showCorrect = isCorrectAnswer && answerStatus === 'correct';
          const showWrong = isSelected && answerStatus === 'wrong';

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleSelectPattern(type)}
              disabled={Boolean(selectedPattern)}
              className={`flex flex-col items-center gap-2 rounded-2xl border-[3px] bg-white p-3 text-center transition-all shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none cursor-pointer ${
                showCorrect
                  ? 'ring-4 ring-green-500 border-green-500'
                  : showWrong
                    ? 'ring-4 ring-rose-500 border-rose-500 animate-pulse'
                    : 'border-[#134E4A]'
              }`}
            >
              <PatternArrow type={type} />
              <span className="text-xs font-black text-[#134E4A]">
                {PATTERN_LABELS[type]}
              </span>
            </button>
          );
        })}
      </div>

      {answerStatus === 'wrong' && (
        <p className="rounded-2xl border-2 border-[#F87171] bg-[#FEE2E2] p-3 text-center text-xs font-bold text-[#991B1B]">
          Pola yang kamu pilih belum tepat. Coba dengar audio lagi ya!
        </p>
      )}

      {answerStatus === 'correct' && (
        <p className="rounded-2xl border-2 border-[#4ADE80] bg-[#DCFCE7] p-3 text-center text-xs font-bold text-[#14532D]">
          Tepat! Pola nada sudah sesuai.
        </p>
      )}
    </div>
  );
};
// Admin quiz service.
//
// Architecture note: quiz logic (NgajiCeriaQuizPage) keeps state on the client
// and questions are still static/mock, so there is no quizzes API yet. This
// service layer returns mock data behind an async signature so AdminQuizzesPage
// already exercises a real loading state; swap the body for a `callREST` call
// once a quizzes endpoint exists.

export type QuizStatus = "active" | "draft";

export interface MockQuiz {
  id: string;
  title: string;
  jilid: number;
  questionsCount: number;
  timeLimit: number;
  rewardStars: number;
  status: QuizStatus;
}

const MOCK_QUIZZES: MockQuiz[] = [
  {
    id: "quiz-hijaiyah-dasar",
    title: "Hijaiyah Dasar",
    jilid: 1,
    questionsCount: 12,
    timeLimit: 10,
    rewardStars: 30,
    status: "active",
  },
  {
    id: "quiz-harakat-fathah",
    title: "Harakat Fathah",
    jilid: 2,
    questionsCount: 15,
    timeLimit: 15,
    rewardStars: 50,
    status: "active",
  },
  {
    id: "quiz-mad-thabi-i",
    title: "Mad Thabi'i",
    jilid: 3,
    questionsCount: 18,
    timeLimit: 20,
    rewardStars: 60,
    status: "active",
  },
  {
    id: "quiz-tajwid-idgham",
    title: "Tajwid: Idgham",
    jilid: 4,
    questionsCount: 20,
    timeLimit: 20,
    rewardStars: 75,
    status: "draft",
  },
  {
    id: "quiz-waqaf-tanda",
    title: "Waqaf & Tanda Baca",
    jilid: 5,
    questionsCount: 16,
    timeLimit: 15,
    rewardStars: 55,
    status: "draft",
  },
  {
    id: "quiz-surah-pendek",
    title: "Surah Pendek Pilihan",
    jilid: 6,
    questionsCount: 24,
    timeLimit: 25,
    rewardStars: 90,
    status: "active",
  },
];

export async function fetchQuizzes(): Promise<MockQuiz[]> {
  // TODO: Replace with `callREST<unknown>("GET", "/api/v1/quizzes")` and a
  // normalizer once the quizzes backend endpoint is available.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_QUIZZES;
}

export async function deleteQuiz(id: string): Promise<void> {
  // TODO: Replace with `callREST<unknown>("DELETE", `/api/v1/quizzes/${id}`)`.
  void id;
  await new Promise((resolve) => setTimeout(resolve, 500));
}

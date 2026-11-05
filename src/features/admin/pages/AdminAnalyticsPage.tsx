import { Avatar } from "@/components/ui";
import {
  BookOpen,
  Star,
  Timer,
  Trophy,
} from "@/components/ui/CustomIcons";
import { StatCard } from "../components/StatCard";
import {
  CARD,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SECTION_TITLE,
  TABLE_WRAP,
  TD,
  TH,
  TR,
} from "../styles";

interface DailyActivity {
  day: string;
  value: number;
}

// Mock data only: analytics aggregation is not wired to a backend yet.
const WEEKLY_ACTIVITY: DailyActivity[] = [
  { day: "Sen", value: 120 },
  { day: "Sel", value: 168 },
  { day: "Rab", value: 142 },
  { day: "Kam", value: 205 },
  { day: "Jum", value: 176 },
  { day: "Sab", value: 248 },
  { day: "Min", value: 132 },
];

interface TopUser {
  id: string;
  name: string;
  sessions: number;
  stars: number;
}

const TOP_USERS: TopUser[] = [
  { id: "u-1", name: "Aisyah Nur", sessions: 96, stars: 1280 },
  { id: "u-2", name: "Abdullah Fattah", sessions: 88, stars: 1150 },
  { id: "u-3", name: "Fatimah Zahra", sessions: 81, stars: 1020 },
  { id: "u-4", name: "Umar Hakim", sessions: 74, stars: 940 },
  { id: "u-5", name: "Khadijah Salsabila", sessions: 69, stars: 870 },
];

/** Warna latar badge peringkat: emas, perak, perunggu, lalu netral. */
const RANK_BG = ["bg-[#FF9F1C]", "bg-[#E5E7EB]", "bg-[#FDBA74]", "bg-[#FFFBF2]", "bg-[#FFFBF2]"];

function ActivityBarChart() {
  const maxValue = Math.max(...WEEKLY_ACTIVITY.map((item) => item.value));

  return (
    <div className="flex h-56 items-stretch gap-2 sm:gap-3">
      {WEEKLY_ACTIVITY.map((item) => {
        const heightPct = Math.round((item.value / maxValue) * 100);
        return (
          <div key={item.day} className="flex flex-1 flex-col items-center">
            <span className="mb-1 text-[10px] font-black tabular-nums text-[#1A1A1A]/70">
              {item.value}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-lg border-[2px] border-b-0 border-[#1A1A1A] bg-[#FFD60A] transition-all duration-150 hover:bg-[#F5C400]"
                style={{ height: `${heightPct}%` }}
                title={`${item.day}: ${item.value} sesi`}
              />
            </div>
            <span className="mt-2 text-xs font-black text-[#1A1A1A]">{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}

function TopUsersTable() {
  return (
    <table className="w-full min-w-[420px] border-collapse text-left text-sm">
      <thead>
        <tr>
          <th className={`px-5 py-3 ${TH}`}>Peringkat</th>
          <th className={`px-5 py-3 ${TH}`}>Pengguna</th>
          <th className={`px-5 py-3 text-right ${TH}`}>Sesi</th>
          <th className={`px-5 py-3 text-right ${TH}`}>Bintang</th>
        </tr>
      </thead>
      <tbody>
        {TOP_USERS.map((user, index) => (
          <tr key={user.id} className={TR}>
            <td className="px-5 py-3">
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border-[2px] border-[#1A1A1A] text-xs font-black text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] ${
                  RANK_BG[index] ?? "bg-[#FFFBF2]"
                }`}
              >
                {index + 1}
              </span>
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size={32} />
                <span className="truncate font-black text-[#1A1A1A]">{user.name}</span>
              </div>
            </td>
            <td className={`px-5 py-3 text-right tabular-nums ${TD}`}>
              {user.sessions}
            </td>
            <td className="px-5 py-3 text-right">
              <span className="inline-flex items-center justify-end gap-1 font-black tabular-nums text-[#1A1A1A]">
                <Star size={12} className="text-[#FF9F1C]" />
                {user.stars}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AdminAnalyticsPage() {
  const weeklyTotal = WEEKLY_ACTIVITY.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="space-y-6 pb-12 font-sans font-bold text-[#1A1A1A]">
      <header className={`p-5 ${CARD}`}>
        <h1 className={PAGE_TITLE}>Analitik</h1>
        <p className={PAGE_SUBTITLE}>
          Ringkasan aktivitas belajar dan performa pengguna Tartila.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Belajar"
          value="1.284"
          icon={<BookOpen size={16} />}
          trend={12}
          trendLabel="sesi · dari minggu lalu"
        />
        <StatCard
          label="Rata-rata Durasi"
          value="18 Mnt"
          icon={<Timer size={16} />}
          trend={4}
          trendLabel="per sesi"
        />
        <StatCard
          label="Kuis Diselesaikan"
          value="6.930"
          icon={<Trophy size={16} />}
          trend={8}
          trendLabel="dari minggu lalu"
        />
      </div>

      <section className={`p-5 ${CARD}`}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className={SECTION_TITLE}>
              Aktivitas Belajar 7 Hari Terakhir
            </h2>
            <p className="mt-0.5 text-xs font-bold text-[#1A1A1A]/70">
              Total {weeklyTotal.toLocaleString("id-ID")} sesi minggu ini
            </p>
          </div>
        </div>
        <ActivityBarChart />
      </section>

      <section className={TABLE_WRAP}>
        <div className="border-b-[3px] border-[#1A1A1A] bg-[#FFFBF2] px-5 py-4">
          <h2 className={SECTION_TITLE}>
            Top 5 Pengguna Paling Aktif
          </h2>
          <p className="mt-0.5 text-xs font-bold text-[#1A1A1A]/70">
            Berdasarkan jumlah sesi belajar 7 hari terakhir
          </p>
        </div>
        <div className="overflow-x-auto">
          <TopUsersTable />
        </div>
      </section>
    </div>
  );
}

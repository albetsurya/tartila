import { Avatar } from "@/components/ui";
import {
  BookOpen,
  Star,
  Timer,
  Trophy,
} from "@/components/ui/CustomIcons";
import { StatCard } from "../components/StatCard";

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

const RANK_ACCENTS = [
  "#d97706",
  "#71717a",
  "#b45309",
  "var(--admin-text-muted)",
  "var(--admin-text-muted)",
];

function ActivityBarChart() {
  const maxValue = Math.max(...WEEKLY_ACTIVITY.map((item) => item.value));

  return (
    <div className="flex h-56 items-stretch gap-2 sm:gap-3">
      {WEEKLY_ACTIVITY.map((item) => {
        const heightPct = Math.round((item.value / maxValue) * 100);
        return (
          <div key={item.day} className="flex flex-1 flex-col items-center">
            <span className="mb-1 text-[10px] tabular-nums admin-muted">
              {item.value}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md transition-all duration-150 hover:opacity-80"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: "var(--admin-accent)",
                }}
                title={`${item.day}: ${item.value} sesi`}
              />
            </div>
            <span className="mt-2 text-xs admin-muted">{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}

function TopUsersTable() {
  return (
    <table className="w-full min-w-[420px] text-sm">
      <thead>
        <tr className="admin-border border-b text-left text-xs admin-muted">
          <th className="px-5 py-3 font-medium">Peringkat</th>
          <th className="px-5 py-3 font-medium">Pengguna</th>
          <th className="px-5 py-3 text-right font-medium">Sesi</th>
          <th className="px-5 py-3 text-right font-medium">Bintang</th>
        </tr>
      </thead>
      <tbody>
        {TOP_USERS.map((user, index) => (
          <tr
            key={user.id}
            className="admin-border border-b transition-colors duration-150 last:border-0 hover:bg-[var(--admin-accent-soft)]"
          >
            <td className="px-5 py-3">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold"
                style={{
                  color: RANK_ACCENTS[index] ?? "var(--admin-text-muted)",
                  backgroundColor: `color-mix(in srgb, ${
                    RANK_ACCENTS[index] ?? "var(--admin-text-muted)"
                  } 16%, transparent)`,
                }}
              >
                {index + 1}
              </span>
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size={32} />
                <span className="truncate font-medium">{user.name}</span>
              </div>
            </td>
            <td className="px-5 py-3 text-right tabular-nums">
              {user.sessions}
            </td>
            <td className="px-5 py-3 text-right">
              <span className="inline-flex items-center justify-end gap-1 tabular-nums font-medium">
                <Star size={12} style={{ color: "var(--admin-accent)" }} />
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
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Analitik</h1>
        <p className="mt-1 text-sm admin-muted">
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

      <section className="admin-surface admin-border rounded-lg border p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">
              Aktivitas Belajar 7 Hari Terakhir
            </h2>
            <p className="mt-0.5 text-xs admin-muted">
              Total {weeklyTotal.toLocaleString("id-ID")} sesi minggu ini
            </p>
          </div>
        </div>
        <ActivityBarChart />
      </section>

      <section className="admin-surface admin-border rounded-lg border">
        <div className="admin-border border-b px-5 py-4">
          <h2 className="text-sm font-semibold">
            Top 5 Pengguna Paling Aktif
          </h2>
          <p className="mt-0.5 text-xs admin-muted">
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

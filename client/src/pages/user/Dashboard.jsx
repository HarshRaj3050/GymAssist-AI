import { useState, useEffect } from "react";
import DashboardNavBar from '../../components/DashboardNavBar';
import QRScanner from "./QRScanner";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api/user";

// ── Static mock data (replace with real API calls as needed) ───
const STATS = [
  { icon: "⏱️", value: "7.8", unit: "/hours", label: "Sleeping Reports", delta: "-19.87%", up: false, color: "#F5A623", highlight: 7 },
  { icon: "👟", value: "8260", unit: "/step", label: "Step Counter", delta: "+63.39%", up: true, color: "#7C6FFF", highlight: 9 },
  { icon: "🔥", value: "200", unit: "/cal", label: "Calories Burn", delta: "-58.02%", up: false, color: "#FF6B6B", highlight: 8 },
  { icon: "❤️", value: "160", unit: "/bpm", label: "Heart Rate Monitor", delta: "+2.87%", up: true, color: "#FF6B6B", isHeart: true },
];

const WEEKLY_GOALS = [
  { icon: "🏋", label: "Weight Loss", value: "1kg", sub: "/120mins", bg: "bg-orange-50", iconBg: "bg-orange-300" },
  { icon: "💪", label: "Push Up", value: "80", sub: "/48mins", bg: "bg-green-50", iconBg: "bg-green-300" },
  { icon: "🧘", label: "Lower Stretch", value: "25", sub: "/20mins", bg: "bg-purple-50", iconBg: "bg-purple-300" },
  { icon: "🤸", label: "ABS and Stretch", value: "1kg", sub: "/80mins", bg: "bg-teal-50", iconBg: "bg-teal-300" },
];

const TRAINERS = [
  { name: "Richard James", role: "Yoga Expert", exp: "3+ years", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=120&q=80", featured: true },
  { name: "Jenny Wilson", role: "Fitness Expert", exp: "8+ years", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=120&q=80", featured: false },
  { name: "Jacob Jones", role: "Push Up Expert", exp: "4+ years", img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=120&q=80", featured: false },
];

const ACTIVITIES = [
  { label: "Ultimate Body Workout", trainer: "Robert Fox", bg: "bg-orange-50", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=70" },
  { label: "Body Weight Workout", trainer: "Jacob Jones", bg: "bg-blue-50", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=70" },
  { label: "Advance Weight Lifting", trainer: "Robert Jr.", bg: "bg-purple-50", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=70" },
];

const BAR_HEIGHTS = [30, 55, 40, 70, 45, 90, 35, 60, 50, 80, 45, 65, 35, 75, 50];

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&q=60",
  "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=40&q=60",
  "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=40&q=60",
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=40&q=60",
];

// ── Mini sparkline bar chart ───────────────────────────────────
function BarChart({ color, highlight }) {
  return (
    <div className="flex items-end gap-0.5 h-12 mt-2">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-200"
          style={{
            height: `${h}%`,
            background: i === highlight ? color : "#F0F0F5",
          }}
        />
      ))}
    </div>
  );
}

// ── Heartbeat line (SVG) ───────────────────────────────────────
function HeartLine() {
  return (
    <svg viewBox="0 0 200 52" className="w-full h-12 mt-2">
      <polyline
        points="0,35 20,35 30,10 40,50 50,20 60,45 70,35 90,35 100,5 110,45 120,25 130,40 150,35 200,35"
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="110" cy="5" r="4" fill="#FF6B6B" />
    </svg>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [userName, setUserName] = useState("Ronald Jr.");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const navigate = useNavigate();


  // Fetch user name from dashboard API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    fetch(`${API}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.userName?.name) setUserName(data.userName.name);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="bg-[#F4F5FA] font-sans overflow-y-auto scrollbar-hide">

      {/* ── Your existing NavBar component ── */}
      <DashboardNavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>

      {/* ── Hamburger mobile sidebar/drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative z-50 w-64 bg-white h-full shadow-2xl flex flex-col p-6 gap-2">
            <div className="flex items-center justify-between mb-6">
              <span className="font-extrabold text-gray-900 text-lg">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            {["Overview", "Activity", "Fitness Goal", "Achievement", "Courses", "Trainers"].map((item) => (
              <button
                key={item}
                onClick={() => { navigate(`/${item.toLowerCase().replace(" ", "-")}`); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  item === "Overview"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
            <div className="mt-auto">
              <button
                onClick={() => { setShowQR(true); setMenuOpen(false); }}
                className="w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm hover:bg-indigo-100 transition-colors"
              >
                📷 Scan QR Code
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── QR Scanner modal ── */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-gray-900 text-base">QR Scanner</h2>
              <button
                onClick={() => setShowQR(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <QRScanner onClose={() => setShowQR(false)} />
          </div>
        </div>
      )}

      {/* ── Page body ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 pb-12 space-y-5">

        {/* ── Hero row ── */}
        <div className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
          {/* Greeting */}
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {greeting}, {loading ? "…" : userName} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">Stay active and healthy to start your day.</p>
          </div>

          {/* Marathon banner */}
          <div className="flex-[2] bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 flex items-center gap-4 w-full sm:w-auto">
            <span className="text-3xl">🌐</span>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm text-gray-900">
                Worldwide 20km Marathon Competition 2024
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Learn more about this event you can visit the following links.
              </p>
            </div>
            <button className="bg-gray-900 text-white rounded-xl px-4 py-2 font-bold text-sm flex-shrink-0 hover:bg-gray-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {STATS.map((s) => (
              <div key={s.label} className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-2xl font-extrabold text-gray-900">{s.value}</span>
                  <span className="text-xs text-gray-400">{s.unit}</span>
                  <span
                    className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      s.up ? "text-green-600 bg-green-100" : "text-red-500 bg-red-100"
                    }`}
                  >
                    {s.delta}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 mb-1">
                  {s.up ? "Better" : "Less"} than yesterday
                </p>
                {s.isHeart ? (
                  <HeartLine />
                ) : (
                  <BarChart color={s.color} highlight={s.highlight} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom 3-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.65fr_0.85fr] gap-4">

          {/* ── Col 1 ── */}
          <div className="flex flex-col gap-4">

            {/* Weekly Goals */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-lg">
                  ➕
                </div>
                <h3 className="font-extrabold text-sm text-gray-900 flex-1">Your Weekly Goals</h3>
                <button className="text-gray-400 text-xl hover:text-gray-600 transition-colors">⋮</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {WEEKLY_GOALS.map((g) => (
                  <div key={g.label} className={`${g.bg} rounded-xl p-3 flex items-center gap-3`}>
                    <div className={`w-9 h-9 ${g.iconBg} bg-opacity-30 rounded-xl flex items-center justify-center text-lg`}>
                      {g.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{g.label}</p>
                      <p className="font-extrabold text-base text-gray-900">
                        {g.value}
                        <span className="font-normal text-[10px] text-gray-400">{g.sub}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
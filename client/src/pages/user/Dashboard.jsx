import { useState, useEffect } from "react";
import QRScanner from "./QRScanner";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api/user";

// ── Static mock data (replace with real API calls as needed) ───
const STATS = [
  { icon: "⏱️", value: "7.8", unit: "/hours", label: "Sleeping Reports", delta: "-19.87%", up: false, color: "#F5A623" },
  { icon: "👟", value: "8260", unit: "/step", label: "Step Counter", delta: "+63.39%", up: true, color: "#7C6FFF" },
  { icon: "🔥", value: "200", unit: "/cal", label: "Calories Burn", delta: "-58.02%", up: false, color: "#FF6B6B" },
  { icon: "❤️", value: "160", unit: "/bpm", label: "Heart Rate Monitor", delta: "+2.87%", up: true, color: "#FF6B6B" },
];

const WEEKLY_GOALS = [
  { icon: "🏋", label: "Weight Loss", value: "1kg", sub: "/120mins", color: "#FFF3E0", iconBg: "#FFAB40" },
  { icon: "💪", label: "Push Up", value: "80", sub: "/48mins", color: "#E8F5E9", iconBg: "#66BB6A" },
  { icon: "🧘", label: "Lower Stretch", value: "25", sub: "/20mins", color: "#EDE7F6", iconBg: "#9575CD" },
  { icon: "🤸", label: "ABS and Stretch", value: "1kg", sub: "/80mins", color: "#E8F5E9", iconBg: "#26A69A" },
];

const TRAINERS = [
  { name: "Richard James", role: "Yoga Expert", exp: "3+ years", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=120&q=80", featured: true },
  { name: "Jenny Wilson", role: "Fitness Expert", exp: "8+ years", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=120&q=80", featured: false },
  { name: "Jacob Jones", role: "Push Up Expert", exp: "4+ years", img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=120&q=80", featured: false },
];

const ACTIVITIES = [
  { label: "Ultimate Body Workout", trainer: "Robert Fox", bg: "#FFF8F0", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=70" },
  { label: "Body Weight Workout", trainer: "Jacob Jones", bg: "#F0F8FF", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=70" },
  { label: "Advance Weight Lifting", trainer: "Robert Jr.", bg: "#F5F0FF", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=70" },
];

const BAR_HEIGHTS = [30, 55, 40, 70, 45, 90, 35, 60, 50, 80, 45, 65, 35, 75, 50];

// ── Mini sparkline bar chart ───────────────────────────────────
function BarChart({ color, highlight }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 52, marginTop: 8 }}>
      {BAR_HEIGHTS.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: `${h}%`, borderRadius: 3,
          background: i === highlight ? color : "#F0F0F5",
          transition: "all 0.2s",
        }} />
      ))}
    </div>
  );
}

// ── Heartbeat line (SVG) ───────────────────────────────────────
function HeartLine() {
  return (
    <svg viewBox="0 0 200 52" style={{ width: "100%", height: 52, marginTop: 8 }}>
      <polyline
        points="0,35 20,35 30,10 40,50 50,20 60,45 70,35 90,35 100,5 110,45 120,25 130,40 150,35 200,35"
        fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinejoin="round"
      />
      <circle cx="110" cy="5" r="4" fill="#FF6B6B" />
    </svg>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [userName, setUserName] = useState("Ronald Jr.");
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("Overview");

  const navigate = useNavigate();

  const NAV = ["Overview", "Activity", "Fitness Goal", "Achievement", "Courses", "Trainers"];

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
    <div style={{
      minHeight: "100vh",
      background: "#F4F5FA",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>

      {/* ── Topbar ── */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #EBEBF0",
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        gap: 8,
        position: "sticky", top: 0, zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{
          width: 36, height: 36, background: "#1A1A2E", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 12, flexShrink: 0,
        }}>
          <span style={{ fontSize: 18 }}>⊛</span>
        </div>

        {/* Nav tabs */}
        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {NAV.map((n) => (
            <button key={n} onClick={() => setActiveNav(n)} style={{
              padding: "7px 18px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontWeight: activeNav === n ? 700 : 500,
              fontSize: 14,
              background: activeNav === n ? "#1A1A2E" : "transparent",
              color: activeNav === n ? "#fff" : "#6B7280",
              transition: "all 0.15s",
            }}>{n}</button>
          ))}
        </nav>










        <div>
          <h2 onClick={()=>{navigate('/scanner')}}>Scan QR</h2>
        </div>











        {/* Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {["🔍", "💬", "🔔"].map((ic) => (
            <button key={ic} style={{
              width: 36, height: 36, border: "1.5px solid #EBEBF0",
              borderRadius: "50%", background: "#fff", cursor: "pointer",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{ic}</button>
          ))}
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80"
            alt="avatar"
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #7C6FFF" }}
          />
        </div>
      </header>

      {/* ── Page body ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 40px" }}>

        {/* ── Hero row ── */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 28px",
          display: "flex", alignItems: "center", gap: 24, marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          {/* Greeting */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1A1A2E", margin: 0 }}>
              {greeting}, {loading ? "…" : userName} 👋
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: 14, marginTop: 4 }}>Stay active and healthy to start your day.</p>
          </div>

          {/* Marathon banner */}
          <div style={{
            flex: 2, background: "linear-gradient(135deg,#F0EEFF,#E8F0FF)",
            borderRadius: 14, padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <span style={{ fontSize: 28 }}>🌐</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#1A1A2E", margin: 0 }}>
                Worldwide 20km Marathon Competition 2024
              </p>
              <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>
                Learn more about this event you can visit the following links.
              </p>
            </div>
            <button style={{
              background: "#1A1A2E", color: "#fff", border: "none",
              borderRadius: 10, padding: "9px 18px",
              fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0,
            }}>Learn More</button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px 24px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0,
          marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: "0 20px",
              borderRight: i < 3 ? "1px solid #F0F0F5" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: "#1A1A2E" }}>{s.value}</span>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>{s.unit}</span>
                <span style={{
                  marginLeft: "auto", fontSize: 11, fontWeight: 700,
                  color: s.up ? "#22C55E" : "#EF4444",
                  background: s.up ? "#DCFCE7" : "#FEE2E2",
                  padding: "2px 6px", borderRadius: 20,
                }}>{s.delta}</span>
              </div>
              <p style={{ color: "#6B7280", fontSize: 12, margin: "0 0 2px" }}>{s.label}</p>
              <p style={{ color: "#9CA3AF", fontSize: 11, margin: "0 0 6px" }}>
                {s.up ? "Better" : "Less"} than yesterday
              </p>
              {s.label === "Heart Rate Monitor"
                ? <HeartLine />
                : <BarChart color={s.color} highlight={i === 1 ? 9 : i === 0 ? 7 : 8} />
              }
            </div>
          ))}
        </div>

        {/* ── Bottom 3-column grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.65fr 0.85fr", gap: 16 }}>

          {/* ── Col 1 ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Weekly Goals */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 40, height: 40, background: "#EEF0FF", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>➕</div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1A1A2E", flex: 1 }}>Your Weekly Goals</h3>
                <button style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 20, cursor: "pointer" }}>⋮</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {WEEKLY_GOALS.map((g) => (
                  <div key={g.label} style={{
                    background: g.color, borderRadius: 14, padding: "14px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 38, height: 38, background: g.iconBg + "30", borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                    }}>{g.icon}</div>
                    <div>
                      <p style={{ color: "#6B7280", fontSize: 12, margin: 0 }}>{g.label}</p>
                      <p style={{ fontWeight: 800, fontSize: 16, color: "#1A1A2E", margin: "2px 0 0" }}>
                        {g.value}<span style={{ fontWeight: 400, fontSize: 11, color: "#9CA3AF" }}>{g.sub}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Activity */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 40, height: 40, background: "#FFF3E0", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>🌲</div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1A1A2E", flex: 1 }}>Recommended Activity</h3>
                <button style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 20, cursor: "pointer" }}>⋮</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {ACTIVITIES.map((a) => (
                  <div key={a.label} style={{
                    background: a.bg, borderRadius: 16, padding: "14px",
                    display: "flex", flexDirection: "column", gap: 10, overflow: "hidden", position: "relative",
                  }}>
                    <p style={{ fontWeight: 800, fontSize: 13, color: "#1A1A2E", margin: 0 }}>{a.label}</p>
                    <p style={{ color: "#9CA3AF", fontSize: 11, margin: 0 }}>
                      Build you body with proper care and guidelines from our mentor.
                    </p>
                    <p style={{ color: "#1A1A2E", fontSize: 11, fontWeight: 700, margin: 0 }}>
                      {a.trainer} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(Fitness expert)</span>
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <button style={{
                        background: "#1A1A2E", color: "#fff", border: "none",
                        borderRadius: 10, padding: "7px 14px",
                        fontWeight: 700, fontSize: 12, cursor: "pointer",
                      }}>Join Now</button>
                      <img src={a.img} alt={a.label}
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 2: Popular Courses ── */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 40, height: 40, background: "#DCFCE7", borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>⚡</div>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1A1A2E" }}>Popular Courses</h3>
            </div>

            {/* Course card */}
            <div style={{
              background: "linear-gradient(135deg,#F8F9FF,#EEF0FF)",
              borderRadius: 16, padding: "18px", flex: 1,
            }}>
              <h4 style={{ fontWeight: 800, fontSize: 17, color: "#1A1A2E", marginBottom: 8 }}>
                Fitness For Beginners
              </h4>
              <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
                1Million people already joined this courses. Here you can{" "}
                <span style={{ color: "#7C6FFF", fontWeight: 700, cursor: "pointer" }}>Learn More</span>
              </p>

              {/* Avatars */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex" }}>
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&q=60",
                    "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=40&q=60",
                    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=40&q=60",
                    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=40&q=60",
                  ].map((src, i) => (
                    <img key={i} src={src} alt=""
                      style={{
                        width: 30, height: 30, borderRadius: "50%", objectFit: "cover",
                        border: "2px solid #fff", marginLeft: i > 0 ? -10 : 0,
                      }} />
                  ))}
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#7C6FFF", color: "#fff",
                    fontSize: 10, fontWeight: 700, border: "2px solid #fff",
                    marginLeft: -10, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>1M+</div>
                </div>
              </div>

              {/* Dumbbell image */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 56 }}>🏋️</span>
              </div>

              {/* Dots */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                {[1, 2, 3, 4].map((d, i) => (
                  <div key={d} style={{
                    width: i === 0 ? 20 : 8, height: 8, borderRadius: 4,
                    background: i === 0 ? "#1A1A2E" : "#D1D5DB",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 3: Trainers + Subscription ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Popular Trainers */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 40, height: 40, background: "#FFF3E0", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>🏆</div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1A1A2E", flex: 1 }}>Our Popular Trainers</h3>
                <button style={{ background: "none", border: "none", color: "#7C6FFF", fontSize: 18, cursor: "pointer" }}>↗</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {TRAINERS.map((t) => (
                  <div key={t.name} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid #F4F5FA",
                  }}>
                    <img src={t.img} alt={t.name}
                      style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#1A1A2E", margin: 0 }}>{t.name}</p>
                      <p style={{ color: "#9CA3AF", fontSize: 12, margin: "2px 0 0" }}>
                        {t.role} / {t.exp}
                      </p>
                    </div>
                    <button style={{
                      padding: "7px 16px",
                      background: t.featured ? "#1A1A2E" : "#fff",
                      color: t.featured ? "#fff" : "#1A1A2E",
                      border: t.featured ? "none" : "1.5px solid #E5E7EB",
                      borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer",
                    }}>Book Now</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Plan */}
            <div style={{
              background: "linear-gradient(135deg,#1A1A2E,#2D2D44)",
              borderRadius: 20, padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, background: "#FFF3E0", borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>👑</div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Subscription Plan</span>
                </div>
                <button style={{
                  background: "#fff", color: "#1A1A2E", border: "none",
                  borderRadius: 10, padding: "7px 14px",
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}>Upgrade Now</button>
              </div>
              <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: "0 0 8px" }}>
                Upgrade Your Subscription Plan
              </h4>
              <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                Consider upgrading your plan to access all features in your fitness app.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
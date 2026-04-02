import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = ["Overview", "Activity", "Attendance", "AI Chat", "Courses", "Trainers"];

const NAV_ICONS = {
    Overview: "□",
    Activity: "↯",
    Attendance: "◎",
    "AI Chat": "✦",
    Courses: "≡",
    Trainers: "◈",
};

const DashboardNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 🔥 important
    const [menuOpen, setMenuOpen] = useState(false);
    const drawerRef = useRef(null);

    /* Route Mapping */
    const routes = {
        Overview: "/dashboard",
        Activity: "/activity",
        Attendance: "/attendance",
        "AI Chat": "/ai-chat",
        Courses: "/courses",
        Trainers: "/trainers",
    };

    /* close drawer on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (!menuOpen) return;
            const hamburger = document.getElementById("dnb-hamburger");
            if (
                drawerRef.current &&
                !drawerRef.current.contains(e.target) &&
                hamburger &&
                !hamburger.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    /* Navigation */
    const handleNav = (n) => {
        setMenuOpen(false);
        navigate(routes[n]);
    };

    return (
        <div className="font-sans">

            {/* ── Top Bar ── */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">

                    {/* Brand */}
                    <span className="font-bold text-gray-900 text-[15px] tracking-tight mr-2 block">
                        GymAssist
                    </span>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 flex-1">
                        {NAV.map((n) => (
                            <button
                                key={n}
                                onClick={() => handleNav(n)}
                                className={[
                                    "px-4 py-2 rounded-full text-[13.5px] font-medium transition-all duration-150 whitespace-nowrap",
                                    location.pathname === routes[n]
                                        ? "bg-gray-900 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
                                ].join(" ")}
                            >
                                {n}
                            </button>
                        ))}
                    </nav>

                    {/* Spacer mobile */}
                    <div className="flex-1 md:hidden" />

                    {/* Scan QR (desktop) */}
                    <button
                        onClick={() => navigate("/scanner")}
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-[13px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
                    >
                        Scan QR
                    </button>

                    {/* Right icons */}
                    <div className="flex items-center gap-2">

                        {/* Search */}
                        <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center">
                            🔍
                        </button>

                        {/* Notification */}
                        <button className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center">
                            🔔
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Avatar */}
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80"
                            alt="avatar"
                            className="w-9 h-9 rounded-xl object-cover border-2 border-gray-900"
                        />
                    </div>

                    {/* Hamburger */}
                    <button
                        id="dnb-hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden w-9 h-9 border rounded-xl flex flex-col items-center justify-center gap-1"
                    >
                        <span className="w-4 h-[2px] bg-black"></span>
                        <span className="w-4 h-[2px] bg-black"></span>
                        <span className="w-4 h-[2px] bg-black"></span>
                    </button>

                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            <div
                ref={drawerRef}
                className={`md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg transition-all ${
                    menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                <div className="p-4 flex flex-col gap-2">

                    {NAV.map((n) => (
                        <button
                            key={n}
                            onClick={() => handleNav(n)}
                            className={`text-left px-4 py-3 rounded-xl ${
                                location.pathname === routes[n]
                                    ? "bg-black text-white"
                                    : "text-gray-600"
                            }`}
                        >
                            {NAV_ICONS[n]} {n}
                        </button>
                    ))}

                    <hr />

                    {/* Scan QR mobile */}
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            navigate("/scanner");
                        }}
                        className="px-4 py-3 border rounded-xl"
                    >
                        Scan QR Code
                    </button>

                </div>
            </div>

        </div>
    );
};

export default DashboardNavBar;
import React from "react";
import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="w-full fixed z-20 flex items-center justify-between px-16  text-white">

            {/* Logo */}
            <div className="flex items-center gap-2">
                <Dumbbell className="text-red-500 w-6 h-6" />
                <h1 className="text-lg font-semibold tracking-wide">
                    FITNESXIA
                </h1>
            </div>

            {/* Menu */}
            <ul className="flex items-center gap-10 text-gray-300">

                <li>
                    <Link to="/" className="hover:text-white">Home</Link>
                </li>

                <li>
                    <Link to="/about" className="hover:text-white">About Us</Link>
                </li>

                <li>
                    <Link to="/program" className="hover:text-white">Program</Link>
                </li>

                <li>
                    <Link to="/membership" className="hover:text-white">Membership</Link>
                </li>

                <li>
                    <Link to="/testimonials" className="hover:text-white">Testimonials</Link>
                </li>

                <li>
                    <Link to="/login">
                        <button className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-medium transition">
                            Log In
                        </button>
                    </Link>
                </li>

            </ul>

        </nav>
    );
};

export default Navbar;
import React from "react";
import { Play } from "lucide-react";
import bgVideo from '../../assets/homePage-bgVideo.mp4'
import Navbar from "../../components/NavBar";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="relative min-h-screen text-white overflow-hidden pt-10">
      <Navbar />

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">

        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:flex gap-100 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-6 max-w-xl">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              GET HEALTHY BODY <br />
              WITH THE PERFECT <br />
              EXERCISES
            </h1>

            <p className="text-gray-300">
              We are always there to help you to make a healthy body
              and mind through the power of fitness.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-6">

              <Link to='/signup' className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition">
                Get Started
              </Link>

              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full">
                  <Play size={20} />
                </div>
                <span className="text-gray-300">Watch Video</span>
              </div>

            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-6 flex-wrap">

              <div>
                <h2 className="text-3xl font-bold">105+</h2>
                <p className="text-gray-400 text-sm">Expert Trainers</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">970+</h2>
                <p className="text-gray-400 text-sm">Member Joined</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">135+</h2>
                <p className="text-gray-400 text-sm">Fitness Programs</p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex justify-center lg:justify-end ">
            <h1 className="text-2xl font-bold">Hello</h1>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Home;
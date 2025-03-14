"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-200">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 -z-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 animate-pulse"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center px-4">
        <img
          src="https://i.imgflip.com/1g8my4.jpg" // Classic "Distracted Boyfriend" meme
          alt="404 Meme"
          className="w-full max-w-md mx-auto rounded-xl shadow-lg mb-8 animate-bounce-slow"
        />
        <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
          Looks like you took a wrong turn in the MemeVerse! Don’t worry, even the best memes get lost sometimes.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 rounded-full font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl border border-purple-400/30"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Easter Egg Animation */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
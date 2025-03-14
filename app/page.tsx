"use client";
import { useEffect, useState } from "react";
import { fetchMemes, Meme } from "@/lib/api/memes";
import { Compass, ArrowRight, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMemes = async () => {
      try {
        const memeData = await fetchMemes();
        setMemes(memeData.slice(0, 6)); // Limit to 6 memes
      } catch (error) {
        console.error("Failed to fetch memes:", error);
      } finally {
        setLoading(false);
      }
    };

    getMemes();
  }, []);

  return (
    <div className="min-h-screen pt-6 bg-background transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-10"></div>
        
        
        {/* Add animated particles for visual interest */}
        <div className="absolute inset-0 z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30 animate-pulse"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 sm:py-24 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
            🔥 Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">MemeVerse</span> 🔥
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Your daily dose of internet humor - discover, share, and create the funniest memes!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/explore" 
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-purple-400 dark:hover:bg-gray-800 px-8 py-4 rounded-full font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Compass className="w-5 h-5" /> 
              <span>Explore Memes</span>
            </Link>
            <Link 
              href="/upload" 
              className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 rounded-full font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl border border-purple-400/30"
            >
              <span>Create Meme</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Memes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center">
            <span className="mr-2">🔥</span> Trending Memes
          </h2>
          <Link
            href="/explore"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium flex items-center gap-1 transition-colors px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="bg-muted animate-pulse rounded-xl h-96"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

type MemeCardProps = {
  meme: Meme;
};

function MemeCard({ meme }: MemeCardProps) {
  return (
    <CardContainer containerClassName="py-4" className="w-full">
      <CardBody className="bg-card border-border rounded-2xl p-6 border shadow-md hover:shadow-xl dark:shadow-gray-900/30 transition-all duration-300 group/card h-auto w-full">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-card-foreground"
        >
          {meme.name}
        </CardItem>
        
        <CardItem
          translateZ="60"
          className="text-muted-foreground text-sm mt-2"
        >
          Hover to interact with this meme
        </CardItem>
        
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={meme.url}
            className="h-60 w-full object-contain rounded-xl shadow-md group-hover/card:shadow-xl transition-all duration-300"
            alt={meme.name}
          />
        </CardItem>
        
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            className="flex items-center gap-4"
          >
            <button className="flex items-center gap-1 text-muted-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium">{Math.floor(Math.random() * 1000)}</span>
            </button>
            
            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{Math.floor(Math.random() * 100)}</span>
            </button>
          </CardItem>
          
          <Link href={`/meme/${meme.id}`}>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white text-xs font-bold transition-colors flex items-center gap-1"
          >
            <span>View Details</span>
          </CardItem>
        </Link>
        </div>
      </CardBody>
    </CardContainer>
  );
}
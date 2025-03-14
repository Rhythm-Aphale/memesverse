"use client";
import { useEffect, useState } from "react";
import { fetchMemes, Meme } from "@/lib/api/memes";
import { Trophy, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopMemes = async () => {
      try {
        const memeData = await fetchMemes();
        // Add mock likes for sorting
        const memesWithLikes = memeData.map((meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 5000), // Random likes up to 5000
        }));
        // Sort by likes and take top 10
        const sortedMemes = memesWithLikes
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 10);
        setTopMemes(sortedMemes);
      } catch (error) {
        console.error("Failed to fetch leaderboard memes:", error);
      } finally {
        setLoading(false);
      }
    };

    getTopMemes();
  }, []);

  return (
    <div className="min-h-screen pt-6 bg-background transition-colors duration-200">
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center">
            <Trophy className="w-8 h-8 mr-2 text-yellow-500" /> Leaderboard
          </h2>
          <Link
            href="/explore"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium flex items-center gap-1 transition-colors px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <span>Explore More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top 10 Memes */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            Top 10 Most Liked Memes
          </h3>
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
              {topMemes.map((meme, index) => (
                <LeaderboardMemeCard key={meme.id} meme={meme} rank={index + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Placeholder for User Rankings */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            Top Users (Coming Soon!)
          </h3>
          <p className="text-muted-foreground">
            User rankings based on engagement will be available soon. Stay tuned!
          </p>
        </div>
      </section>
    </div>
  );
}

type LeaderboardMemeCardProps = {
  meme: Meme;
  rank: number;
};

function LeaderboardMemeCard({ meme, rank }: LeaderboardMemeCardProps) {
  const rankColors = {
    1: "bg-yellow-400 text-black",
    2: "bg-gray-300 text-black",
    3: "bg-orange-400 text-black",
  };

  return (
    <CardContainer containerClassName="py-4" className="w-full">
      <CardBody className="bg-card border-border rounded-2xl p-6 border shadow-md hover:shadow-xl dark:shadow-gray-900/30 transition-all duration-300 group/card h-auto w-full relative">
        {/* Rank Badge */}
        <div
          className={`absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
            rankColors[rank as keyof typeof rankColors] || "bg-purple-600 text-white"
          }`}
        >
          {rank}
        </div>

        <CardItem translateZ="50" className="text-xl font-bold text-card-foreground">
          {meme.name}
        </CardItem>

        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={meme.url}
            className="h-60 w-full object-contain rounded-xl shadow-md group-hover/card:shadow-xl transition-all duration-300"
            alt={meme.name}
          />
        </CardItem>

        <div className="flex justify-between items-center mt-6">
          <CardItem translateZ={20} className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium">{meme.likes}</span>
            </span>
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
"use client";
import { useEffect, useState, Suspense } from "react";
import { fetchMemes, Meme } from "@/lib/api/memes";
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useSearchParams } from "next/navigation";

// Separate component that uses useSearchParams
function MemesContent() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("likes");
  const memesPerPage = 12;
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const getMemes = async () => {
      try {
        const memeData = await fetchMemes();
        const memesWithMockData = memeData.map((meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        }));
        setMemes(memesWithMockData);
      } catch (error) {
        console.error("Failed to fetch memes:", error);
      } finally {
        setLoading(false);
      }
    };

    getMemes();
  }, []);

  // Filter and sort memes (same as your original code)
  const filteredBySearch = memes.filter(meme => 
    meme.name.toLowerCase().includes(searchQuery)
  );

  let filteredByCategory = filteredBySearch;
  if (selectedCategory === "trending") {
    filteredByCategory = filteredByCategory.filter(meme => meme.likes > 500);
  } else if (selectedCategory === "new") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filteredByCategory = filteredByCategory.filter(meme => meme.createdAt > thirtyDaysAgo);
  } else if (selectedCategory === "classic") {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    filteredByCategory = filteredByCategory.filter(meme => meme.createdAt < oneYearAgo);
  }

  let sortedMemes = [...filteredByCategory];
  if (selectedCategory === "random") {
    sortedMemes = sortedMemes.sort(() => Math.random() - 0.5);
  } else {
    switch (selectedSort) {
      case "likes":
        sortedMemes.sort((a, b) => b.likes - a.likes);
        break;
      case "date":
        sortedMemes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "comments":
        sortedMemes.sort((a, b) => b.comments - a.comments);
        break;
    }
  }

  // Pagination
  const startIndex = (page - 1) * memesPerPage;
  const endIndex = startIndex + memesPerPage;
  const paginatedMemes = sortedMemes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedMemes.length / memesPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedSort]);

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
          ></div>
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center">
            <span className="mr-2">🌍</span> Explore All Memes
          </h2>
          <Link
            href="/"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium flex items-center gap-1 transition-colors px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <span>Back Home</span>
          </Link>
        </div>

        {/* Search Header */}
        {searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-lg text-muted-foreground">
              Showing results for: <span className="font-semibold text-foreground">{searchQuery}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredBySearch.length} matching meme{filteredBySearch.length !== 1 && 's'}
            </p>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
          {["all", "trending", "new", "classic", "random"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="mb-8 flex justify-end">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-card border border-border rounded-full px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="likes">Sort by Likes</option>
            <option value="date">Sort by Date</option>
            <option value="comments">Sort by Comments</option>
          </select>
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
          <>
            {sortedMemes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-2xl mb-4">😢 No memes found</div>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse our popular templates
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedMemes.map((meme) => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 space-x-4">
                    <button
                      className={`p-2 rounded-xl ${
                        page === 1 
                          ? "bg-muted cursor-not-allowed" 
                          : "bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                      } transition-all duration-200 shadow-lg hover:shadow-xl`}
                      disabled={page === 1}
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <span className="flex items-center px-6 py-2 text-lg font-semibold bg-card text-foreground rounded-xl shadow-md">
                      Page {page} of {totalPages}
                    </span>
                    
                    <button
                      className={`p-2 rounded-xl ${
                        page === totalPages 
                          ? "bg-muted cursor-not-allowed" 
                          : "bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                      } transition-all duration-200 shadow-lg hover:shadow-xl`}
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// Main Explore page component with Suspense boundary
export default function Explore() {
  return (
    <Suspense fallback={<div>Loading memes...</div>}>
      <MemesContent />
    </Suspense>
  );
}

// MemeCard component remains unchanged
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
              <span className="text-xs font-medium">{meme.likes}</span>
            </button>
            
            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{meme.comments}</span>
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
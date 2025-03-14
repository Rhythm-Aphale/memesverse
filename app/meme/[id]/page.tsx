"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMemes, Meme } from "@/lib/api/memes";
import { Heart, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type Comment = {
  id: string;
  text: string;
  author: string;
  timestamp: number;
};

export default function MemeDetailsPage() {
  const { id } = useParams();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadMeme = async () => {
      try {
        const memes = await fetchMemes();
        const foundMeme = memes.find((m: Meme) => m.id === id);
        
        if (!foundMeme) {
          setError("Meme not found");
          return;
        }
        
        setMeme(foundMeme);
        loadPersistedData(foundMeme.id);
      } catch (err) {
        setError("Failed to load meme");
      } finally {
        setLoading(false);
      }
    };

    loadMeme();
  }, [id]);

  const loadPersistedData = (memeId: string) => {
    const persistedLikes = localStorage.getItem(`meme-${memeId}-likes`);
    if (persistedLikes) {
      setLikes(JSON.parse(persistedLikes).count);
      setIsLiked(JSON.parse(persistedLikes).isLiked);
    }

    const persistedComments = localStorage.getItem(`meme-${memeId}-comments`);
    if (persistedComments) {
      setComments(JSON.parse(persistedComments));
    }
  };

  const handleLike = () => {
    if (!meme) return;

    const newLikes = isLiked ? likes - 1 : likes + 1;
    const newLikeState = !isLiked;

    setLikes(newLikes);
    setIsLiked(newLikeState);

    localStorage.setItem(
      `meme-${meme.id}-likes`,
      JSON.stringify({ count: newLikes, isLiked: newLikeState })
    );
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !meme) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      text: newComment,
      author: "Anonymous",
      timestamp: Date.now(),
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment("");

    localStorage.setItem(
      `meme-${meme.id}-comments`,
      JSON.stringify(updatedComments)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-2xl text-purple-600">Loading...</div>
      </div>
    );
  }

  if (error || !meme) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-2xl text-red-600 mb-4">{error}</div>
        <Link
          href="/"
          className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Memes
        </Link>

        {/* Main Meme Card - Mobile Optimized */}
        <div className="mb-8">
          <CardContainer className="w-full">
            <CardBody className="bg-card border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Meme Image - Reordered for mobile */}
                <CardItem translateZ="50" className="p-4 order-2 md:order-1 h-64 md:h-auto">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={meme.url}
                      alt={meme.name}
                      className="max-w-full max-h-64 md:max-h-80 object-contain rounded-xl"
                    />
                  </div>
                </CardItem>

                {/* Meme Details - Priority on mobile */}
                <div className="p-6 order-1 md:order-2">
                  <CardItem translateZ="30" className="mb-4">
                    <h1 className="text-2xl font-bold text-foreground">
                      {meme.name}
                    </h1>
                  </CardItem>

                  {/* Enhanced Like Button */}
                  <CardItem translateZ="20" className="flex items-center gap-6 mb-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 ${
                        isLiked ? "text-red-500" : "text-muted-foreground"
                      } transition-colors text-lg`}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isLiked ? "fill-red-500" : ""
                        }`}
                      />
                      <span className="font-medium">{likes}</span>
                    </button>
                  </CardItem>
                </div>
              </div>
            </CardBody>
          </CardContainer>
        </div>

        {/* Share Section */}
        <div className="bg-card border-border rounded-xl p-6 mb-8 shadow-md">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Share this meme
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share via:</span>
            </div>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                window.location.href
              )}&text=${encodeURIComponent(
                `Check out this meme: ${meme.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-card border-border rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Comments ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
            <button
              type="submit"
              className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-muted rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">
                    {comment.author}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-foreground">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
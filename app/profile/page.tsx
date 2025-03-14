"use client";
import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { getUserMemes } from "@/lib/api/memes";
import { Heart, MessageCircle, LogOut, Edit, Save, X, Sun, Moon } from "lucide-react";

export default function ProfilePage() {
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  const [userMemes, setUserMemes] = useState<any[]>([]);
  const [likedMemes, setLikedMemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedPhoto, setEditedPhoto] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEditedName(currentUser.displayName || "");
        setEditedPhoto(currentUser.photoURL || "");
        const bio = localStorage.getItem(`bio_${currentUser.uid}`) || "";
        setEditedBio(bio);
        await loadMemes(currentUser.uid);
        loadLikedMemes(currentUser.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const loadMemes = async (userId: string) => {
    try {
      const memes = await getUserMemes(userId);
      setUserMemes(memes);
    } catch (error) {
      console.error("Error loading memes:", error);
    }
  };

  const loadLikedMemes = (userId: string) => {
    const liked = JSON.parse(localStorage.getItem(`likedMemes_${userId}`) || "[]");
    setLikedMemes(liked);
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user, {
        displayName: editedName,
        photoURL: editedPhoto
      });
      localStorage.setItem(`bio_${user.uid}`, editedBio);
      setUser({ ...user, displayName: editedName, photoURL: editedPhoto });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const cancelEdit = () => {
    if (user) {
      setEditedName(user.displayName || "");
      setEditedPhoto(user.photoURL || "");
      setEditedBio(localStorage.getItem(`bio_${user.uid}`) || "");
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black dark:bg-black hover:bg-black dark:hover:bg-black transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {!user ? (
          <div className="border border-black dark:border-white p-8 rounded-xl text-center bg-white dark:bg-gray-800 text-black dark:text-white">
            <h2 className="text-3xl font-bold mb-6">Sign in to view profile</h2>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="space-y-8 text-black dark:text-white">
            <div className="flex items-center justify-between border-b dark:border-black pb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={editedPhoto || "/default-avatar.png"}
                    className="w-20 h-20 rounded-full border-2 border-black dark:border-white object-cover"
                    alt="Profile"
                  />
                  {editMode && (
                    <input
                      type="text"
                      value={editedPhoto}
                      onChange={(e) => setEditedPhoto(e.target.value)}
                      className="absolute bottom-0 text-xs w-full p-1 border bg-white dark:bg-gray-800 text-black dark:text-white"
                      placeholder="Image URL"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  {editMode ? (
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-3xl font-bold border p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold">{editedName}</h1>
                  )}
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  {editMode ? (
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="border p-2 w-full bg-white dark:bg-gray-800 text-black dark:text-white"
                      placeholder="Add bio"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-300">{editedBio}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {editMode && (
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 border border-black dark:border-white hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                )}
                <button
                  onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  {editMode ? <Save size={20} /> : <Edit size={20} />}
                  {editMode ? "Save" : "Edit"}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4">Uploaded Memes ({userMemes.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userMemes.length > 0 ? (
                  userMemes.map((meme) => (
                    <div key={meme.id} className="border border-black dark:border-white rounded-lg p-4 bg-white dark:bg-black">
                      <img
                        src={meme.imageUrl}
                        className="w-full h-48 object-contain mb-4"
                        alt="Meme"
                      />
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart size={16} />
                          <span>{Math.floor(Math.random() * 1000)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{Math.floor(Math.random() * 100)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    You haven't uploaded any memes yet
                  </p>
                )}
              </div>
            </section>

            <section>
            <h2 className="text-2xl font-bold mb-4">Liked Memes ({likedMemes.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {likedMemes.length > 0 ? (
                likedMemes.map((meme) => (
                  <div 
                    key={meme.id} 
                    className="border border-black dark:border-white rounded-lg p-4 bg-white dark:bg-black"
                  >
                    <img
                      src={meme.imageUrl} // Ensure this matches the stored property
                      className="w-full h-48 object-contain mb-4"
                      alt="Meme"
                    />
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart size={16} className="fill-red-500 text-red-500" />
                        <span>{meme.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  You haven't liked any memes yet
                </p>
              )}
            </div>
          </section>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect, useRef } from "react";
import { uploadImageToImgBB, fetchMemes, Meme, generateMeme, saveMemeToDatabase } from "@/lib/api/memes";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, Sparkles, RefreshCw, Save } from "lucide-react";
import Image from "next/image";

export default function UploadPage() {
  const [memeTemplates, setMemeTemplates] = useState<Meme[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Meme | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<"template" | "custom">("template");
  const [generatingAI, setGeneratingAI] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch meme templates on component mount
  useEffect(() => {
    const getTemplates = async () => {
      try {
        const templates = await fetchMemes();
        setMemeTemplates(templates);
      } catch (error) {
        console.error("Failed to fetch meme templates:", error);
      }
    };

    getTemplates();

    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Redirect to login if not authenticated
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadType("custom");
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template: Meme) => {
    setSelectedTemplate(template);
    setPreviewUrl(template.url);
    setUploadType("template");
  };

  // Generate AI suggestions for captions
  const generateAISuggestions = () => {
    setGeneratingAI(true);
    
    // Mock AI suggestions (in a real app, you'd call an AI API)
    setTimeout(() => {
      const suggestions = [
        "When you finally debug that code after 5 hours",
        "Me explaining my project to non-technical friends",
        "How it feels to fix someone else's code",
        "That moment when your code works on the first try"
      ];
      setAiSuggestions(suggestions);
      setGeneratingAI(false);
    }, 1500);
  };

  // Handle upload/creation of meme
  const handleMemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      alert("Please log in to upload memes");
      return;
    }
    
    setLoading(true);
    try {
      let finalImageUrl = "";
      
      if (uploadType === "template" && selectedTemplate) {
        // Generate meme from template
        finalImageUrl = await generateMeme(
          selectedTemplate.id,
          topText,
          bottomText
        );
      } else if (uploadType === "custom" && selectedFile) {
        // Upload custom image
        finalImageUrl = await uploadImageToImgBB(selectedFile);
      } else {
        throw new Error("Please select a template or upload an image");
      }
      
      // Save meme to database
      await saveMemeToDatabase({
        userId,
        imageUrl: finalImageUrl,
        caption: caption || "No caption provided",
        createdAt: new Date()
      });
      
      // Show success message and redirect
      alert("Meme uploaded successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error creating meme:", error);
      alert("Failed to create meme. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Create Your Meme</h1>
      
      {/* Upload Type Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setUploadType("template")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              uploadType === "template"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Use Template
          </button>
          <button
            type="button"
            onClick={() => {
              setUploadType("custom");
              fileInputRef.current?.click();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              uploadType === "custom"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Upload Image
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Template Selection or Image Upload */}
        <div>
          {uploadType === "template" ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Select a Template</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2">
                {memeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedTemplate?.id === template.id
                        ? "border-purple-500 shadow-lg"
                        : "border-transparent"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <img
                      src={template.url}
                      alt={template.name}
                      className="w-full h-32 object-contain bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upload Your Image</h2>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Meme Editor */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Customize Your Meme</h2>
          
          <form onSubmit={handleMemeSubmit}>
            {/* Preview Area */}
            {previewUrl ? (
              <div className="mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-center">
                <div className="relative max-w-md">
                  <img
                    src={previewUrl}
                    alt="Meme Preview"
                    className="max-h-[300px] object-contain rounded"
                  />
                  {uploadType === "template" && (
                    <>
                      <div className="absolute top-4 left-0 right-0 text-center">
                        <p className="text-2xl font-bold text-white stroke-black" style={{ 
                          WebkitTextStroke: '1px black',
                          textShadow: '2px 2px 0 #000'
                        }}>
                          {topText}
                        </p>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <p className="text-2xl font-bold text-white stroke-black" style={{ 
                          WebkitTextStroke: '1px black',
                          textShadow: '2px 2px 0 #000'
                        }}>
                          {bottomText}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-12 flex justify-center">
                <ImageIcon className="h-24 w-24 text-gray-400" />
              </div>
            )}
            
            {/* Text Editor for Template */}
            {uploadType === "template" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="topText" className="block text-sm font-medium mb-1">
                    Top Text
                  </label>
                  <input
                    type="text"
                    id="topText"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter top text"
                  />
                </div>
                <div>
                  <label htmlFor="bottomText" className="block text-sm font-medium mb-1">
                    Bottom Text
                  </label>
                  <input
                    type="text"
                    id="bottomText"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter bottom text"
                  />
                </div>
              </div>
            )}
            
            {/* Caption */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <label htmlFor="caption" className="block text-sm font-medium mb-1">
                  Caption
                </label>
                <button
                  type="button"
                  onClick={generateAISuggestions}
                  className="inline-flex items-center text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  {generatingAI ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      Generate AI Caption
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add a funny caption for your meme"
                rows={3}
              />
              
              {/* AI Caption Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">AI Caption Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCaption(suggestion)}
                        className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full px-3 py-1 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (!previewUrl)}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-md text-white font-medium ${
                loading || !previewUrl
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save & Upload Meme
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
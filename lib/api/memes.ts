import axios from "axios";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { app } from "@/lib/firebase/firebase";

// Interfaces
export interface Meme {
  createdAt: Date;
  comments: any;
  date: string | number | Date;
  likes: number;
  caption?: string;
  imageUrl?: string;
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

export interface UserMeme {
  id?: string;
  userId: string;
  imageUrl: string;
  caption: string;
  createdAt: any; // Consider using firebase.firestore.Timestamp for better typing
}

// Environment variables
const IMGFLIP_USERNAME = process.env.NEXT_PUBLIC_IMGFLIP_USERNAME || "";
const IMGFLIP_PASSWORD = process.env.NEXT_PUBLIC_IMGFLIP_PASSWORD || "";
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

// Initialize Firestore
const db = getFirestore(app);
const memesCollection = collection(db, "memes");

// Fetch popular meme templates from Imgflip API
export const fetchMemes = async (): Promise<Meme[]> => {
  try {
    const response = await axios.get("https://api.imgflip.com/get_memes");
    if (!response.data.success) {
      throw new Error("Imgflip API response unsuccessful");
    }
    
    return response.data.data.memes.map((meme: any) => ({
      id: meme.id,
      name: meme.name,
      url: meme.url,
      width: meme.width,
      height: meme.height,
    }));
  } catch (error) {
    console.error("Error fetching memes:", error);
    throw error; // Consider throwing instead of returning empty array for better error handling
  }
};

// Upload image to ImgBB
export const uploadImageToImgBB = async (file: File | FormData): Promise<string> => {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is missing");
  }

  try {
    const formData = file instanceof File ? new FormData() : file;
    if (file instanceof File) {
      formData.append("image", file);
    }

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error("ImgBB upload failed");
    }

    return response.data.data.url;
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    throw error;
  }
};

// Save meme to Firestore
export const saveMemeToDatabase = async (meme: UserMeme): Promise<string> => {
  try {
    const docRef = await addDoc(memesCollection, {
      ...meme,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving meme to Firestore:", error);
    throw error;
  }
};

// Get user's memes from Firestore
export const getUserMemes = async (userId: string): Promise<UserMeme[]> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const q = query(memesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as UserMeme),
    }));
  } catch (error) {
    console.error("Error fetching user memes from Firestore:", error);
    throw error;
  }
};

// Generate meme using Imgflip API
export const generateMeme = async (
  templateId: string,
  topText: string,
  bottomText: string
): Promise<string> => {
  if (!IMGFLIP_USERNAME || !IMGFLIP_PASSWORD) {
    throw new Error("Imgflip credentials are missing");
  }

  if (!templateId) {
    throw new Error("Template ID is required");
  }

  try {
    const formData = new URLSearchParams();
    formData.append("template_id", templateId);
    formData.append("username", IMGFLIP_USERNAME);
    formData.append("password", IMGFLIP_PASSWORD);
    formData.append("text0", topText || ""); // Ensure empty string if undefined
    formData.append("text1", bottomText || "");

    const response = await axios.post(
      "https://api.imgflip.com/caption_image",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to generate meme");
    }

    return response.data.data.url;
  } catch (error) {
    console.error("Error generating meme with Imgflip:", error);
    throw error;
  }
};

// Generate meme using Memegen.link API
export const generateMemeWithMemegenAPI = async (
  templateId: string,
  topText: string,
  bottomText: string
): Promise<string> => {
  // Fix: customText seems to be a typo, should be bottomText
  const formattedTop = encodeURIComponent(topText.replace(/ /g, "_") || "-");
  const formattedBottom = encodeURIComponent(bottomText.replace(/ /g, "_") || "-");

  return `https://memegen.link/${templateId}/${formattedTop}/${formattedBottom}.jpg`;
};
# MemeVerse

MemeVerse is a multi-page, highly interactive meme platform where users can explore, upload, and interact with memes. This project showcases advanced frontend development skills, including UI/UX design, animations, state management, performance optimization, API handling, and Firebase authentication.

## 🚀 Live Demo
[🔗 MemeVerse Live](https://memesverse.vercel.app/)

## 📌 Features & Functionalities

### 🏠 Homepage (Landing Page)
- Displays trending memes dynamically (Fetched from an API).
- Interactive animations & transitions.
- Dark mode toggle.

### 🔍 Meme Explorer Page
- Infinite scrolling or pagination.
- Meme categories filter (Trending, New, Classic, Random).
- Search functionality with debounced API calls.
- Sort memes by likes, date, or comments.

### 📤 Meme Upload Page
- Upload memes (image/gif format).
- Add funny captions using a text editor.
- Option to generate AI-based meme captions.
- Preview before uploading.

### 📄 Meme Details Page
- Dynamic routing (`/meme/:id`).
- Displays meme details, likes, comments, and sharing options.
- Comment system (Local storage for now).
- Like buttons with animation and local storage persistence.

### 👤 User Profile Page
- Shows user-uploaded memes.
- Edit profile info (Name, Bio, Profile Picture).
- View liked memes (saved in local storage or API).

### 🏆 Leaderboard Page
- Displays the top 10 most liked memes.
- User rankings based on engagement.

### ❌ 404 Page (Easter Egg)
- Fun, meme-based 404 error page for non-existent routes.

## 🛠 Tech Stack
- **Next.js (App Router) / React (Hooks & Components)**
- **Tailwind CSS** (For styling)
- **Shade CN** (Forn Better UI)
- **Framer Motion / GSAP** (For animations)
- **Redux Toolkit / Context API** (For state management)
- **Local Storage / IndexedDB** (For caching data)
- **Meme APIs** (Fetching memes dynamically)
- **Cloudinary / Firebase** (For image uploads)
- **Firebase Authentication** (For user login & signup)
- **Lighthouse / React Profiler** (For performance optimization)

## 🔗 APIs Used
- **Meme APIs:**
  - [Imgflip API](https://imgflip.com/api) - Generate and fetch popular memes.
  - [Meme Generator API](https://memegen.link/) - Create memes dynamically.
- **Image Upload & Storage APIs:**
  - [Imgbb](https://api.imgbb.com/) - Store and manage uploaded images.

## 🔐 Authentication
- Implemented **Firebase Authentication** for user login, signup, and profile management.
- Secure login using **Email/Password & Google Authentication**.
- User session persistence.

## 📈 Performance Optimization
- **Lazy loading** of images and components.
- **Code splitting** using dynamic imports.
- **Optimized API calls** with caching and loading states.
- **Efficient state management** using Redux Toolkit.

## 📱 Accessibility & Responsiveness
- **Mobile-first design** for seamless browsing.
- **Accessible UI elements** with proper ARIA attributes.
- **Keyboard navigation support**.

## 🛠 Setup & Installation
To run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/memeverse.git
   cd memeverse
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env.local` file and add the necessary environment variables:
   ```sh
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   NEXT_PUBLIC_IMGFLIP_USERNAME=your_imgflip_username
   NEXT_PUBLIC_IMGFLIP_PASSWORD=your_imgflip_password
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open your browser and go to:
   ```sh
   http://localhost:3000
   ```

## 📂 Not Found Page Route
The custom 404 page is located at:
```sh
app/[...not-found]/page.tsx
```



---
🔥 Have fun memeing with **MemeVerse**! 🚀


import express from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import Sentiment from "sentiment";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = 3000;
const sentiment = new Sentiment();

const getYoutubeClient = () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is missing. Please add it to your environment variables.");
  }
  return google.youtube({
    version: "v3",
    auth: apiKey,
  });
};

app.use(express.json());

// API Routes
app.get("/api/video-info", async (req, res) => {
  const { videoId } = req.query;

  if (!videoId || typeof videoId !== "string") {
    return res.status(400).json({ error: "Video ID is required" });
  }

  try {
    const youtube = getYoutubeClient();
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json({
      title: video.snippet?.title,
      commentCount: video.statistics?.commentCount,
      thumbnail: video.snippet?.thumbnails?.high?.url,
    });
  } catch (error: any) {
    console.error("YouTube API Error:", error);
    if (error.errors?.[0]?.reason === "quotaExceeded") {
      return res.status(429).json({ error: "YouTube API limit reached. Try again later." });
    }
    res.status(500).json({ error: error.message || "Failed to fetch video info" });
  }
});

app.get("/api/comments", async (req, res) => {
  const { videoId, maxResults = "500" } = req.query;

  if (!videoId || typeof videoId !== "string") {
    return res.status(400).json({ error: "Video ID is required" });
  }

  try {
    const youtube = getYoutubeClient();
    let allComments: any[] = [];
    let nextPageToken: string | undefined | null = undefined;
    const limit = parseInt(maxResults as string) || 500;

    // Fetch up to 500 comments (5 pages of 100) to keep it reasonable for a demo
    // The user can specify maxResults if needed
    let pagesFetched = 0;
    const maxPages = Math.ceil(limit / 100);

    do {
      const response: any = await youtube.commentThreads.list({
        part: ["snippet"],
        videoId: videoId,
        maxResults: 100,
        pageToken: nextPageToken || undefined,
        order: "relevance",
      });

      const items = response.data.items || [];
      const formattedComments = items.map((item: any) => {
        const snippet = item.snippet.topLevelComment.snippet;
        const text = snippet.textDisplay;
        const analysis = sentiment.analyze(text);
        
        let sentimentLabel = "neutral";
        if (analysis.score > 0) sentimentLabel = "positive";
        else if (analysis.score < 0) sentimentLabel = "negative";

        return {
          id: item.id,
          username: snippet.authorDisplayName,
          comment: text,
          likes: snippet.likeCount,
          publishedAt: snippet.publishedAt,
          sentiment: sentimentLabel,
          profileImageUrl: snippet.authorProfileImageUrl,
        };
      });

      allComments = [...allComments, ...formattedComments];
      nextPageToken = response.data.nextPageToken;
      pagesFetched++;
    } while (nextPageToken && pagesFetched < maxPages);

    res.json({ comments: allComments.slice(0, limit) });
  } catch (error: any) {
    console.error("YouTube API Error:", error);
    if (error.errors?.[0]?.reason === "commentsDisabled") {
      return res.status(403).json({ error: "Comments are disabled for this video." });
    }
    if (error.errors?.[0]?.reason === "quotaExceeded") {
      return res.status(429).json({ error: "YouTube API limit reached. Try again later." });
    }
    res.status(500).json({ error: error.message || "Failed to fetch comments" });
  }
});

// Vite middleware for development (only run if not as a Netlify function)
if (process.env.NODE_ENV !== "production" && !process.env.NETLIFY) {
  const startServer = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  startServer();
} else if (process.env.NODE_ENV === "production" && !process.env.NETLIFY) {
  // Local production server (not Netlify)
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

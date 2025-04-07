const express = require("express");
const cors = require("cors");
const { getSubtitles } = require("youtube-captions-scraper");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/transcript", async (req, res) => {
  const videoId = req.query.videoId;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId parameter." });
  }

  try {
    const captions = await getSubtitles({ videoID: videoId, lang: "en" });
    const transcript = captions.map((cap) => cap.text).join(" ");
    res.json({ transcript });
  } catch (err) {
    console.error("Error fetching captions:", err.message);
    res.status(500).json({ error: "Failed to fetch captions." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

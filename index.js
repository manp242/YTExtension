const express = require("express");
const cors = require("cors");
const { getSubtitles } = require("youtube-captions-scraper");

const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPEN,
});

const app = express();
const PORT = 3000;

app.use(express.json());

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

app.post("/res", async (req, res) => {
  const { question, transcript } = req.body;

  if (!question || !transcript) {
    return res.status(400).json({ error: "Missing question or transcript." });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Based on the transcript, answer this in 15–20 words max.\n\nQuestion: ${question}\n\nTranscript: ${transcript}`,
        },
      ],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (err) {
    console.error("Error from OpenAI:", err.message);
    res.status(500).json({ error: "Failed to get GPT response." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

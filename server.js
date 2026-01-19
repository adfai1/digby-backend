const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

const STOP_URL = "https://bustimes.org/stops/1100DEA57473";

app.get("/", (req, res) => {
  res.send("Digby backend is running");
});

app.get("/times", async (req, res) => {
  try {
    const html = await fetch(STOP_URL).then(r => r.text());
    const $ = cheerio.load(html);

    const results = [];

    $(".timetable .service").each((_, el) => {
      const service = $(el).find(".service-name").text().trim();
      const destination = $(el).find(".destination").text().trim();
      const time = $(el).find(".time").text().trim();

      if (service && time) {
        results.push({ service, destination, time });
      }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to load times" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
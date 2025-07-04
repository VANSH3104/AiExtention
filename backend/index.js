import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import fetch from "node-fetch"
import { createWorker } from "tesseract.js"

dotenv.config()

const app = express()
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: "20mb" }))
app.use(bodyParser.urlencoded({ extended: true }))

const isValidImageUrl = (url) => {
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

const extractTextFromImage = async (imageData) => {
  const worker = await createWorker('eng');
  try {
    const { data: { text } } = await worker.recognize(imageData);
    console.log(text)
    return text;
  } finally {
    await worker.terminate();
  }
}

app.post("/api/ocr", async (req, res) => {
  const { imageUrl } = req.body
    console.log(imageUrl)
  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL or base64 data is required" })
  }

  try {
    let imageData

    if (imageUrl.startsWith("data:image/")) {
      // Strip the data URL prefix and convert to Buffer
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "")
      imageData = Buffer.from(base64Data, "base64")
    } else if (isValidImageUrl(imageUrl)) {
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      imageData = Buffer.from(arrayBuffer)
    } else {
      return res.status(400).json({ error: "Invalid image URL or format" })
    }

    const extractedText = await extractTextFromImage(imageData)

    res.json({
      success: true,
      text: extractedText
    })
  } catch (err) {
    res.status(500).json({ error: "OCR processing failed", details: err.message })
  }
})


app.get("/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 OCR Server running at http://localhost:${PORT}`)
})

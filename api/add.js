import connectDB from "../lib/mongodb.js"
import DiaryEntry from "../models/DiaryEntry.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    await connectDB()

    const { author, content, title } = req.body

    if (!author || !content || !title) {
      return res.status(400).json({
        success: false,
        message: "Author, title, and content are required",
      })
    }

    if (!["bar", "ara"].includes(author)) {
      return res.status(400).json({
        success: false,
        message: 'Author must be either "bar" or "ara"',
      })
    }

    const newEntry = new DiaryEntry({
      author,
      title,
      content,
    })

    await newEntry.save()

    res.status(201).json({
      success: true,
      message: "Diary entry added successfully",
      data: newEntry,
    })
  } catch (error) {
    console.error("Error adding entry:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add diary entry",
    })
  }
}

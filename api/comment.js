import connectDB from "../lib/mongodb.js"
import DiaryEntry from "../models/DiaryEntry.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    await connectDB()

    const { entryId, author, content } = req.body

    if (!entryId || !author || !content) {
      return res.status(400).json({
        success: false,
        message: "Entry ID, author, and content are required",
      })
    }

    if (!["bar", "ara"].includes(author)) {
      return res.status(400).json({
        success: false,
        message: 'Author must be either "bar" or "ara"',
      })
    }

    const entry = await DiaryEntry.findById(entryId)

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Diary entry not found",
      })
    }

    entry.comments.push({
      author,
      content,
    })

    await entry.save()

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: entry,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    })
  }
}

import connectDB from "../lib/mongodb.js"
import DiaryEntry from "../models/DiaryEntry.js"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    await connectDB()

    const entries = await DiaryEntry.find({}).sort({ createdAt: -1 }).limit(20)

    // Separate entries by author
    const barEntries = entries.filter((entry) => entry.author === "bar")
    const araEntries = entries.filter((entry) => entry.author === "ara")

    res.status(200).json({
      success: true,
      data: {
        bar: barEntries,
        ara: araEntries,
      },
    })
  } catch (error) {
    console.error("Error fetching entries:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch diary entries",
    })
  }
}

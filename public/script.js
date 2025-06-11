let currentAuthor = "bar"
let entries = { bar: [], ara: [] }

// DOM elements
const barBtn = document.getElementById("barBtn")
const araBtn = document.getElementById("araBtn")
const barEntries = document.getElementById("barEntries")
const araEntries = document.getElementById("araEntries")
const barEntriesList = document.getElementById("barEntriesList")
const araEntriesList = document.getElementById("araEntriesList")
const entryForm = document.getElementById("entryForm")

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadEntries()
  setupEventListeners()
})

function setupEventListeners() {
  // Author selector buttons
  barBtn.addEventListener("click", () => switchAuthor("bar"))
  araBtn.addEventListener("click", () => switchAuthor("ara"))

  // Entry form submission
  entryForm.addEventListener("submit", handleEntrySubmit)
}

function switchAuthor(author) {
  currentAuthor = author

  // Update button states
  barBtn.classList.toggle("active", author === "bar")
  araBtn.classList.toggle("active", author === "ara")

  // Show/hide entry sections
  barEntries.style.display = author === "bar" ? "block" : "none"
  araEntries.style.display = author === "ara" ? "block" : "none"
}

async function loadEntries() {
  try {
    const response = await fetch("/api")
    const result = await response.json()

    if (result.success) {
      entries = result.data
      renderEntries()
    } else {
      console.error("Failed to load entries:", result.message)
    }
  } catch (error) {
    console.error("Error loading entries:", error)
  }
}

function renderEntries() {
  renderEntriesForAuthor("bar", barEntriesList)
  renderEntriesForAuthor("ara", araEntriesList)
}

function renderEntriesForAuthor(author, container) {
  container.innerHTML = ""

  if (!entries[author] || entries[author].length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #8b5a83; font-style: italic;">No stories yet. Be the first to share! 💕</p>`
    return
  }

  entries[author].forEach((entry) => {
    const entryElement = createEntryElement(entry)
    container.appendChild(entryElement)
  })
}

function createEntryElement(entry) {
  const entryDiv = document.createElement("div")
  entryDiv.className = "entry-card"

  const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  entryDiv.innerHTML = `
        <div class="entry-header">
            <div class="entry-title">${entry.title}</div>
            <div class="entry-date">${date}</div>
        </div>
        <div class="entry-content">${entry.content}</div>
        <div class="comments-section">
            <div class="comments-list">
                ${entry.comments
                  .map(
                    (comment) => `
                    <div class="comment">
                        <div class="comment-author">${comment.author === "bar" ? "Bar 🌸" : "Ara 🌺"}</div>
                        <div class="comment-content">${comment.content}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="comment-form">
                <select class="comment-author-select">
                    <option value="">Who's commenting?</option>
                    <option value="bar">Bar</option>
                    <option value="ara">Ara</option>
                </select>
                <input type="text" class="comment-input" placeholder="Add a loving comment...">
                <button type="button" class="comment-btn" onclick="addComment('${entry._id}', this)">💕</button>
            </div>
        </div>
    `

  return entryDiv
}

async function handleEntrySubmit(e) {
  e.preventDefault()

  const author = document.getElementById("authorSelect").value
  const title = document.getElementById("titleInput").value
  const content = document.getElementById("contentInput").value

  if (!author || !title || !content) {
    alert("Please fill in all fields!")
    return
  }

  try {
    const response = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ author, title, content }),
    })

    const result = await response.json()

    if (result.success) {
      // Clear form
      entryForm.reset()

      // Reload entries
      await loadEntries()

      // Show success message
      alert("Story shared successfully! 💕")
    } else {
      alert("Failed to share story: " + result.message)
    }
  } catch (error) {
    console.error("Error adding entry:", error)
    alert("Failed to share story. Please try again.")
  }
}

async function addComment(entryId, button) {
  const commentForm = button.parentElement
  const authorSelect = commentForm.querySelector(".comment-author-select")
  const commentInput = commentForm.querySelector(".comment-input")

  const author = authorSelect.value
  const content = commentInput.value.trim()

  if (!author || !content) {
    alert("Please select who is commenting and write a comment!")
    return
  }

  try {
    const response = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entryId, author, content }),
    })

    const result = await response.json()

    if (result.success) {
      // Clear comment form
      authorSelect.value = ""
      commentInput.value = ""

      // Reload entries
      await loadEntries()
    } else {
      alert("Failed to add comment: " + result.message)
    }
  } catch (error) {
    console.error("Error adding comment:", error)
    alert("Failed to add comment. Please try again.")
  }
}

import { useState } from "react"

function IndexPopup() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setResult("")

    const reader = new FileReader()
    reader.onload = async () => {
      const base64Image = reader.result as string

      try {
        const res = await fetch("http://localhost:3001/api/ocr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ imageUrl: base64Image })
        })

        const data = await res.json()
        setResult(data.result || "No result from AI.")
      } catch (err) {
        setResult("⚠️ Failed to fetch AI result.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="w-[320px] p-4 font-sans">
      <h1 className="text-lg font-semibold mb-2 text-purple-700">🧠 SmartShop AI</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-3"
      />

      {loading && <p>⏳ Analyzing image...</p>}
      {result && (
        <div className="mt-2 p-2 bg-gray-100 text-sm rounded whitespace-pre-wrap max-h-[200px] overflow-auto">
          {result}
        </div>
      )}
    </div>
  )
}

export default IndexPopup

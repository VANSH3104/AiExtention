// Enhanced SmartShop AI Button Injector with Dialog
function injectSmartSearchButton() {
  const searchContainer = document.querySelector(
    'div.flex.flex-auto.items-center.relative'
  )
  
  if (!searchContainer || document.getElementById("smartshop-ai-btn")) return
  
  // Create the main button
  const btn = document.createElement("button")
  btn.id = "smartshop-ai-btn"
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="21 21l-4.35-4.35"/>
      <rect x="8" y="8" width="6" height="6" rx="1"/>
    </svg>
    <span>AI Search</span>
  `
  btn.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  `
  
  // Add hover effect
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-1px)'
    btn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
  })
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)'
    btn.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)'
  })
  
  // Create dialog
  btn.onclick = () => createImageSearchDialog()
  
  searchContainer.appendChild(btn)
}

function createImageSearchDialog() {
  // Remove existing dialog if any
  const existingDialog = document.getElementById('smartshop-dialog')
  if (existingDialog) {
    existingDialog.remove()
  }
  
  // Create dialog overlay
  const overlay = document.createElement('div')
  overlay.id = 'smartshop-dialog'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `
  
  // Create dialog content
  const dialog = document.createElement('div')
  dialog.style.cssText = `
    background: white;
    border-radius: 20px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: scale(0.9);
    transition: transform 0.3s ease;
  `
  
  dialog.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #1f2937;">
        🧠 SmartShop AI Search
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Upload an image to find similar products and get AI-powered insights
      </p>
    </div>
    
    <div id="upload-area" style="
      border: 2px dashed #d1d5db;
      border-radius: 16px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 24px;
    ">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" style="margin: 0 auto 16px;">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
      <p style="margin: 0 0 8px; font-size: 16px; font-weight: 500; color: #374151;">
        Click to upload or drag & drop
      </p>
      <p style="margin: 0; font-size: 14px; color: #9ca3af;">
        PNG, JPG, GIF up to 10MB
      </p>
    </div>
    
    <div id="loading-area" style="display: none; text-align: center; padding: 20px;">
      <div style="
        width: 40px;
        height: 40px;
        border: 3px solid #f3f4f6;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      "></div>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Analyzing image with AI...
      </p>
    </div>
    
    <div id="result-area" style="display: none;">
      <div style="
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      ">
        <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #1f2937;">
          AI Analysis Results
        </h3>
        <div id="result-content" style="color: #374151; font-size: 14px; line-height: 1.5;"></div>
      </div>
    </div>
    
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="cancel-btn" style="
        background: #f3f4f6;
        color: #374151;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s ease;
      ">
        Cancel
      </button>
      <button id="proceed-search-btn" style="
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        display: none;
      ">
        Proceed Search
      </button>
      <button id="new-search-btn" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        display: none;
      ">
        New Search
      </button>
    </div>
  `
  
  // Add CSS animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
  
  overlay.appendChild(dialog)
  document.body.appendChild(overlay)
  
  // Animate in
  requestAnimationFrame(() => {
    overlay.style.opacity = '1'
    dialog.style.transform = 'scale(1)'
  })
  
  // Setup event listeners
  setupDialogEvents(overlay)
}

function setupDialogEvents(overlay) {
  const uploadArea = overlay.querySelector('#upload-area')
  const loadingArea = overlay.querySelector('#loading-area')
  const resultArea = overlay.querySelector('#result-area')
  const resultContent = overlay.querySelector('#result-content')
  const cancelBtn = overlay.querySelector('#cancel-btn')
  const proceedSearchBtn = overlay.querySelector('#proceed-search-btn')
  const newSearchBtn = overlay.querySelector('#new-search-btn')
  
  // File input
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.style.display = 'none'
  
  // Upload area click
  uploadArea.addEventListener('click', () => fileInput.click())
  
  // Upload area hover
  uploadArea.addEventListener('mouseenter', () => {
    uploadArea.style.borderColor = '#667eea'
    uploadArea.style.backgroundColor = '#f8fafc'
  })
  
  uploadArea.addEventListener('mouseleave', () => {
    uploadArea.style.borderColor = '#d1d5db'
    uploadArea.style.backgroundColor = 'transparent'
  })
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = '#667eea'
    uploadArea.style.backgroundColor = '#f8fafc'
  })
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#d1d5db'
    uploadArea.style.backgroundColor = 'transparent'
  })
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = '#d1d5db'
    uploadArea.style.backgroundColor = 'transparent'
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files[0])
    }
  })
  
  // File input change
  fileInput.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement
    const file = input.files && input.files[0]
    if (file) {
      handleImageUpload(file)
    }
  })
  
  // Handle image upload
  async function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    
    uploadArea.style.display = 'none'
    loadingArea.style.display = 'block'
    resultArea.style.display = 'none'
    proceedSearchBtn.style.display = 'none'
    newSearchBtn.style.display = 'none'
    
    const reader = new FileReader()
    reader.onload = async function() {
      const base64 = reader.result
      
      try {
        const res = await fetch("http://localhost:3001/api/ocr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ imageUrl: base64 })
        })
        const data = await res.json()
        
        loadingArea.style.display = 'none'
        resultArea.style.display = 'block'
        const extractedText = data.text
        resultContent.innerHTML = `<h4>Extracted Text:</h4><p>${extractedText}</p>`
        proceedSearchBtn.dataset.searchText = encodeURIComponent(extractedText.trim().replace(/\s+/g, '+'))
        proceedSearchBtn.style.display = 'inline-block'
        newSearchBtn.style.display = 'inline-block'
      } catch (err) {
        loadingArea.style.display = 'none'
        resultArea.style.display = 'block'
        resultContent.innerHTML = `<pre>${JSON.stringify(err, null, 2)}</pre>`
        newSearchBtn.style.display = 'inline-block'
        console.error(err)
      }
    }
    
    reader.readAsDataURL(file)
  }
  
  // Proceed search button
  proceedSearchBtn.addEventListener('click', () => {
    const searchQuery = proceedSearchBtn.dataset.searchText || 'smartshop+products'
    window.open(`https://www.walmart.com/search?q=${searchQuery}`, '_blank')
  })
  
  // Cancel button
  cancelBtn.addEventListener('click', () => {
    overlay.style.opacity = '0'
    setTimeout(() => overlay.remove(), 300)
  })
  
  // New search button
  newSearchBtn.addEventListener('click', () => {
    uploadArea.style.display = 'block'
    loadingArea.style.display = 'none'
    resultArea.style.display = 'none'
    proceedSearchBtn.style.display = 'none'
    newSearchBtn.style.display = 'none'
    fileInput.value = ''
  })
  
  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.opacity = '0'
      setTimeout(() => overlay.remove(), 300)
    }
  })
  
  // Escape key to close
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      overlay.style.opacity = '0'
      setTimeout(() => overlay.remove(), 300)
      document.removeEventListener('keydown', escapeHandler)
    }
  })
}

// Initialize the injection
const interval = setInterval(() => {
  if (document.querySelector('div.flex.flex-auto.items-center.relative')) {
    clearInterval(interval)
    injectSmartSearchButton()
  }
}, 500)

// Re-inject on page changes (for SPAs)
const observer = new MutationObserver(() => {
  if (document.querySelector('div.flex.flex-auto.items-center.relative') && 
      !document.getElementById("smartshop-ai-btn")) {
    injectSmartSearchButton()
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true
})
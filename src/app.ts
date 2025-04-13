import express from "express";
import apicache from "apicache";
import { discordSelf, discordUser } from "./api";
import 'dotenv/config';

const app = express();
const cache = apicache.middleware;

app.get("/", (req, res) => {
  const testUserId = "994135527815118898";
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Discord Profile Preview Generator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --discord-primary: #5865F2;
        --discord-primary-hover: #4752c4;
        --discord-bg: #313338;
        --discord-bg-secondary: #2B2D31;
        --discord-bg-tertiary: #1E1F22;
        --discord-text: #F2F3F5;
        --discord-text-muted: #B5BAC1;
        --discord-input-bg: #1E1F22;
        --discord-border: #232428;
        --discord-success: #3BA55C;
        --discord-radius: 8px;
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        background-color: var(--discord-bg);
        color: var(--discord-text);
        line-height: 1.6;
        padding: 30px 20px;
        margin: 0;
      }
      
      .container {
        max-width: 1100px;
        margin: 0 auto;
      }
      
      h1 {
        color: var(--discord-primary);
        margin-bottom: 30px;
        font-size: 2rem;
        text-align: center;
        position: relative;
        display: inline-block;
        left: 50%;
        transform: translateX(-50%);
      }
      
      h1::after {
        content: '';
        display: block;
        height: 3px;
        width: 60px;
        background: var(--discord-primary);
        margin: 10px auto 0;
        border-radius: 3px;
      }
      
      .controls {
        display: flex;
        gap: 24px;
        margin-bottom: 30px;
        flex-wrap: wrap;
      }
      
      .column {
        flex: 1;
        min-width: 300px;
        background-color: var(--discord-bg-secondary);
        padding: 24px;
        border-radius: var(--discord-radius);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--discord-border);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .column:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }
      
      .preview {
        background-color: var(--discord-bg-tertiary);
        padding: 20px;
        border-radius: var(--discord-radius);
        margin-bottom: 20px;
        border: 1px solid var(--discord-border);
        overflow: hidden;
      }
      
      .preview img {
        max-width: 100%;
        height: auto;
        border-radius: calc(var(--discord-radius) - 2px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      
      .preview:hover img {
        transform: scale(1.02);
      }
      
      input, textarea, button, select {
        width: 100%;
        padding: 12px 14px;
        margin-bottom: 18px;
        background-color: var(--discord-input-bg);
        border: 1px solid var(--discord-border);
        border-radius: var(--discord-radius);
        color: var(--discord-text);
        font-family: inherit;
        font-size: 14px;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: var(--discord-primary);
        box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.2);
      }
      
      textarea {
        min-height: 120px;
        resize: vertical;
      }
      
      button {
        background-color: var(--discord-primary);
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s, transform 0.1s;
        color: white;
        border: none;
        font-size: 15px;
      }
      
      button:hover {
        background-color: var(--discord-primary-hover);
      }
      
      button:active {
        transform: translateY(1px);
      }
      
      .checkbox-container {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .checkbox-container input {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        margin-bottom: 0;
        cursor: pointer;
        accent-color: var(--discord-primary);
      }
      
      .checkbox-container label {
        cursor: pointer;
      }
      
      .result-box {
        background-color: var(--discord-input-bg);
        padding: 15px;
        border-radius: var(--discord-radius);
        word-break: break-all;
        text-align: left;
        margin-top: 10px;
        border: 1px solid var(--discord-border);
        font-family: monospace;
        font-size: 13px;
        color: var(--discord-text-muted);
      }
      
      .label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--discord-text-muted);
        font-size: 14px;
      }
      
      .section {
        margin-bottom: 24px;
      }
      
      .section:last-child {
        margin-bottom: 0;
      }
      
      .color-input-group {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .color-input-group input[type="color"] {
        width: 50px;
        height: 40px;
        padding: 2px;
        border-radius: var(--discord-radius);
        cursor: pointer;
      }
      
      .copy-success {
        color: var(--discord-success);
        font-weight: 600;
      }
      
      @media (max-width: 768px) {
        .controls {
          flex-direction: column;
        }
        
        .column {
          min-width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Discord Profile Preview Generator</h1>
      
      <div class="controls">
        <div class="column">
          <div class="section">
            <span class="label">User ID</span>
            <input type="text" id="userId" placeholder="Discord User ID" value="${testUserId}">
          </div>
          
          <div class="section">
            <div class="checkbox-container">
              <input type="checkbox" id="enableAboutMe">
              <label for="enableAboutMe">Enable About Me</label>
            </div>
            
            <span class="label">About Me</span>
            <textarea id="aboutMe" placeholder="About me content..." disabled></textarea>
          </div>
          
          <div class="section">
            <div class="checkbox-container">
              <input type="checkbox" id="overrideBanner">
              <label for="overrideBanner">Override Banner</label>
            </div>
            
            <span class="label">Banner URL</span>
            <input type="text" id="bannerUrl" placeholder="https://example.com/banner.png" disabled>
          </div>
          
          <div class="section">
            <div class="checkbox-container">
              <input type="checkbox" id="hideDecoration">
              <label for="hideDecoration">Hide Avatar Decoration</label>
            </div>
          </div>
          
          <div class="section">
            <span class="label">Theme Colors</span>
            <div style="margin-bottom: 15px;">
              <div class="checkbox-container">
                <input type="radio" id="defaultColor" name="colorOption" value="default" checked>
                <label for="defaultColor">Default Colors</label>
              </div>
              <div class="checkbox-container">
                <input type="radio" id="useProfileColor" name="colorOption" value="profile">
                <label for="useProfileColor">Use Profile's Colors</label>
              </div>
              <div class="checkbox-container">
                <input type="radio" id="customColor" name="colorOption" value="custom">
                <label for="customColor">Custom Color</label>
              </div>
              <div class="color-input-group">
                <input type="color" id="themeColorPicker" value="#5865F2" disabled>
                <input type="text" id="themeColorText" value="#5865F2" placeholder="#RRGGBB" disabled>
              </div>
            </div>
          </div>
          
          <button id="generatePreview">Generate Preview</button>
        </div>
        
        <div class="column">
          <div class="section">
            <span class="label">Preview</span>
            <div class="preview">
              <img id="previewImage" src="/api/user/${testUserId}" alt="Discord Profile Preview">
            </div>
          </div>
          
          <div class="section">
            <span class="label">Preview URL</span>
            <div class="result-box" id="previewUrl"></div>
          </div>
          
          <button id="copyUrl">Copy URL</button>
        </div>
      </div>
    </div>

    <script>
      document.addEventListener('DOMContentLoaded', function() {
        // Elements
        const userIdInput = document.getElementById('userId');
        const enableAboutMeCheckbox = document.getElementById('enableAboutMe');
        const aboutMeTextarea = document.getElementById('aboutMe');
        const overrideBannerCheckbox = document.getElementById('overrideBanner');
        const bannerUrlInput = document.getElementById('bannerUrl');
        const hideDecorationCheckbox = document.getElementById('hideDecoration');
        
        // Color options
        const defaultColorRadio = document.getElementById('defaultColor');
        const useProfileColorRadio = document.getElementById('useProfileColor');
        const customColorRadio = document.getElementById('customColor');
        const themeColorPicker = document.getElementById('themeColorPicker');
        const themeColorText = document.getElementById('themeColorText');
        
        const generateButton = document.getElementById('generatePreview');
        const previewImage = document.getElementById('previewImage');
        const previewUrlDisplay = document.getElementById('previewUrl');
        const copyUrlButton = document.getElementById('copyUrl');
        
        // Enable/disable fields based on checkboxes
        enableAboutMeCheckbox.addEventListener('change', function() {
          aboutMeTextarea.disabled = !this.checked;
          if (this.checked) {
            aboutMeTextarea.focus();
          }
        });
        
        overrideBannerCheckbox.addEventListener('change', function() {
          bannerUrlInput.disabled = !this.checked;
          if (this.checked) {
            bannerUrlInput.focus();
          }
        });
        
        // Theme color controls
        defaultColorRadio.addEventListener('change', function() {
          if (this.checked) {
            themeColorPicker.disabled = true;
            themeColorText.disabled = true;
          }
        });
        
        useProfileColorRadio.addEventListener('change', function() {
          if (this.checked) {
            themeColorPicker.disabled = true;
            themeColorText.disabled = true;
          }
        });
        
        customColorRadio.addEventListener('change', function() {
          if (this.checked) {
            themeColorPicker.disabled = false;
            themeColorText.disabled = false;
            themeColorPicker.focus();
          }
        });
        
        // Sync color picker with text input
        themeColorPicker.addEventListener('input', function() {
          themeColorText.value = this.value.toUpperCase();
        });
        
        themeColorText.addEventListener('input', function() {
          if (this.value.match(/^#[0-9A-Fa-f]{6}$/i)) {
            themeColorPicker.value = this.value;
          }
        });
        
        // Generate preview
        generateButton.addEventListener('click', function() {
          const userId = userIdInput.value.trim();
          if (!userId) {
            alert('Please enter a Discord User ID');
            return;
          }
          
          // Add loading state
          generateButton.textContent = 'Generating...';
          generateButton.disabled = true;
          
          // Build URL
          let url = \`/api/user/\${userId}\`;
          const params = new URLSearchParams();
          
          if (enableAboutMeCheckbox.checked && aboutMeTextarea.value) {
            params.append('aboutMe', aboutMeTextarea.value);
          }
          
          if (overrideBannerCheckbox.checked && bannerUrlInput.value) {
            params.append('banner', bannerUrlInput.value);
          }
          
          if (hideDecorationCheckbox.checked) {
            params.append('hideDecoration', 'true');
          }
          
          // Add theme color parameters
          if (useProfileColorRadio.checked) {
            params.append('useProfileColor', 'true');
          } else if (customColorRadio.checked) {
            params.append('themeColor', themeColorText.value);
          }
          
          if (params.toString()) {
            url += \`?\${params.toString()}\`;
          }
          
          // Update preview
          previewImage.style.opacity = '0.5';
          
          // Create new image to handle load event
          const newImage = new Image();
          newImage.onload = function() {
            previewImage.src = url;
            previewImage.style.opacity = '1';
            previewUrlDisplay.textContent = window.location.origin + url;
            generateButton.textContent = 'Generate Preview';
            generateButton.disabled = false;
          };
          
          newImage.onerror = function() {
            alert('Failed to generate image. Please check the User ID and try again.');
            generateButton.textContent = 'Generate Preview';
            generateButton.disabled = false;
            previewImage.style.opacity = '1';
          };
          
          newImage.src = url;
        });
        
        // Copy URL
        copyUrlButton.addEventListener('click', function() {
          const urlText = previewUrlDisplay.textContent;
          if (!urlText) return;
          
          navigator.clipboard.writeText(urlText)
            .then(() => {
              copyUrlButton.textContent = 'Copied!';
              copyUrlButton.classList.add('copy-success');
              setTimeout(() => {
                copyUrlButton.textContent = 'Copy URL';
                copyUrlButton.classList.remove('copy-success');
              }, 2000);
            })
            .catch(err => {
              console.error('Failed to copy: ', err);
              alert('Failed to copy URL');
            });
        });
        
        // Initialize preview URL
        previewUrlDisplay.textContent = window.location.origin + \`/api/user/\${userIdInput.value.trim()}\`;
        
        // Add smooth transitions for image
        previewImage.style.transition = 'opacity 0.3s ease';
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
          if (e.ctrlKey && e.key === 'Enter') {
            generateButton.click();
          }
        });
      });
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

app.get("/api/ping", discordSelf);
app.get("/api/user/:id", cache('5 minutes'), discordUser);

export default app;
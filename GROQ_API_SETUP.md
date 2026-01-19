# 🚀 How to Enable AI Provider (Groq API)

## Step 1: Get a Free Groq API Key

1. Visit: **https://console.groq.com/keys**
2. Sign up for a free account (if not already done)
3. Create a new API key
4. Copy the API key (starts with `gsk_`)

## Step 2: Set the Environment Variable

### Option A: Windows (PowerShell)
```powershell
$env:GROQ_API_KEY='your_api_key_here'
```

### Option B: Windows (Command Prompt)
```cmd
set GROQ_API_KEY=your_api_key_here
```

### Option C: Create .env file in backend folder
Create `backend/.env` with:
```
GROQ_API_KEY=gsk_your_api_key_here
PORT=5000
NODE_ENV=development
```

## Step 3: Restart Backend Server

After setting the environment variable:

1. Stop the backend server (Ctrl+C in terminal)
2. Restart it: `npm start`
3. The AI provider should now be configured ✅

## Step 4: Test

1. Upload an Excel file
2. Go to AI Analytics tab
3. Select an analysis type
4. Click Analyze

You should now see AI results! 🎉

---

## Free Groq Tier Limits

✅ **30 requests per minute** (Free)  
✅ **No credit card required**  
✅ **Mixtral 8x7B model** (Powerful & Fast)  
✅ **32K token context window**  

---

## Troubleshooting

**If you still get "No AI provider configured":**

1. ✅ Verify API key is set: `echo $env:GROQ_API_KEY`
2. ✅ Restart backend server
3. ✅ Check backend logs for errors
4. ✅ Ensure API key hasn't expired

**If you get API errors:**

1. ✅ Check internet connection
2. ✅ Verify API key is correct
3. ✅ Check Groq status: https://status.groq.com
4. ✅ Wait a moment and retry

---

## Want to Use OpenAI Instead?

Set `OPENAI_API_KEY` environment variable with your OpenAI key.

The platform supports both:
- **Groq** (Free, Fast)
- **OpenAI** (ChatGPT API)

---

**Once configured, the AI features will be fully functional!** 🚀

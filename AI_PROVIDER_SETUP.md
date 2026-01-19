# 🚀 AI Provider Setup - Enable Groq API

## Problem
Error: **"No AI provider configured"**

This means the Groq API key is not set in the environment variables.

---

## ✅ Solution - 3 Quick Steps

### Step 1: Get Free Groq API Key (2 minutes)

1. **Visit:** https://console.groq.com/keys
2. **Sign up** (free - no credit card needed)
3. **Create API key**
4. **Copy** the key (looks like: `gsk_xxxxxxxxxxxxx`)

### Step 2: Set Environment Variable

**Option A: Quick Setup (Windows)**
```bash
Double-click: setup-groq-api.bat
Paste your API key when prompted
Done! ✓
```

**Option B: Manual Setup (PowerShell)**
```powershell
$env:GROQ_API_KEY='gsk_your_api_key_here'
```

**Option C: Manual Setup (Command Prompt)**
```cmd
set GROQ_API_KEY=gsk_your_api_key_here
```

### Step 3: Restart Backend Server

```bash
# Stop current server (Ctrl+C)
# Then restart it:
cd backend
npm start
```

---

## ✅ Verify It's Working

1. **Upload an Excel file**
2. **Go to AI Analytics tab**
3. **Select any analysis type**
4. **Click Analyze**

You should see AI results! 🎉

---

## 📊 Free Groq Tier

- ✅ **30 requests/minute** (more than enough)
- ✅ **No credit card required**
- ✅ **Mixtral 8x7B model** (powerful & fast)
- ✅ **Unlimited usage** (within rate limit)

---

## 🔍 Troubleshooting

### Still getting error after setup?

1. **Verify API key is set:**
   ```powershell
   echo $env:GROQ_API_KEY
   ```
   Should show your key starting with `gsk_`

2. **Check if key is valid:**
   - Go back to https://console.groq.com/keys
   - Verify key hasn't been revoked

3. **Restart backend:**
   - Stop server (Ctrl+C)
   - Start again: `npm start`

4. **Check logs:**
   - Look for errors in backend terminal
   - Verify network connection

### Getting API errors?

- ✅ Wait a moment and retry
- ✅ Check internet connection
- ✅ Verify Groq status: https://status.groq.com
- ✅ Try a different analysis type

---

## 📁 Files for Setup

- **GROQ_API_SETUP.md** - Detailed setup guide
- **setup-groq-api.bat** - Windows setup script (Recommended!)

---

## 🎯 After Setup

All AI features will work:

✅ **General Analysis** - Ask questions about data  
✅ **Deep Analysis** - Correlation, Regression, Anomaly, Clustering  
✅ **Comparative Analysis** - Compare metrics  
✅ **Data Quality** - Quality reports & recommendations  
✅ **Data Summary** - Statistical analysis  

---

## 💡 Pro Tips

1. **Multiple Analyses** - You can run multiple analyses rapidly (30/min limit)
2. **Batch Processing** - Upload multiple files and analyze them
3. **Fallback Mode** - Platform works without API too (limited features)
4. **Switch Providers** - Can also use OpenAI if you set `OPENAI_API_KEY`

---

## ❓ Questions?

- See **GROQ_API_SETUP.md** for detailed guide
- Run **setup-groq-api.bat** for easy setup (Windows)
- Check backend logs for errors

---

**You're just 3 steps away from full AI capabilities!** 🚀

Get your free API key now: https://console.groq.com/keys

# 🎤 Arabic TTS Setup Guide

## 🌟 Better Arabic Voice Solutions

Your app now supports **multiple high-quality Arabic TTS services** with fallback to browser voices!

### 🚀 Current Implementation

The app now tries TTS services in this priority order:
1. **ElevenLabs** (Best quality, supports Arabic)
2. **Lahajati.ai** (Arabic specialized, 108+ dialects)
3. **Browser TTS** (Enhanced Arabic voice selection)

---

## 🔧 Setup Instructions

### 1. ElevenLabs (Recommended - Best Quality)

**Free Tier:** 10,000 characters/month

1. **Sign up:** https://elevenlabs.io/
2. **Get API Key:** Dashboard → Profile → API Key
3. **Add to .env.local:**
```env
ELEVENLABS_API_KEY=your_api_key_here
```
4. **Uncomment API code** in `src/app/api/tts-elevenlabs/route.ts`

**Available Arabic Voices:**
- `Haytham` - Arabic male voice (clear, professional)
- `Sana` - Arabic female voice (warm, child-friendly)

### 2. Lahajati.ai (Arabic Specialized)

**Free Tier:** 10,000 points/month

1. **Sign up:** https://lahajati.ai/
2. **Get API Key:** Dashboard → API Access
3. **Add to .env.local:**
```env
LAHAJATI_API_KEY=your_api_key_here
```
4. **Uncomment API code** in `src/app/api/tts-lahajati/route.ts`

**Available Arabic Dialects:**
- Saudi (ar-SA) - Salma (female), Ahmed (male)
- Egyptian (ar-EG) - Omar (male)
- UAE (ar-AE) - Layla (female)
- Lebanese (ar-LB) - Fatima (female)

### 3. SpeechGen.io (Alternative)

**Free Tier:** 1,000 characters/month

1. **Sign up:** https://speechgen.io/
2. Follow similar setup pattern

---

## 👥 Character Icons Setup

### Current Characters (All with Emoji Icons)

Your app now uses **profession-based characters** that are easy to get icons for:

1. **🧑‍⚕️ Dr. Sarah** (الدكتورة سارة) - Medical professional
2. **👨‍🏫 Mr. Omar** (الأستاذ عمر) - Teacher  
3. **👩‍🍳 Chef Layla** (الشيف ليلى) - Chef
4. **👨‍🚒 Ahmed the Hero** (أحمد البطل) - Firefighter
5. **👮‍♀️ Officer Fatima** (الضابطة فاطمة) - Police officer
6. **🧙‍♂️ Wizard Hassan** (الساحر حسان) - Wizard

### 🎨 Getting Professional Icons

#### Option 1: Free Icon Websites
1. **Flaticon** - https://www.flaticon.com/
   - Search: "doctor woman", "teacher man", "chef woman", etc.
   - Download PNG (512x512 recommended)

2. **Icons8** - https://icons8.com/
   - Search: "profession icons", "cartoon characters"
   - Download as PNG

3. **Freepik** - https://www.freepik.com/
   - Search: "profession characters cartoon"
   - Free with attribution

#### Option 2: AI-Generated Icons
1. **DALL-E 3** or **Midjourney**
   - Prompt: "Cartoon female doctor character, friendly, colorful, simple style"
   - Generate 512x512 images

#### Option 3: Canva
1. Go to https://canva.com/
2. Create 512x512 design
3. Use profession character templates
4. Download as PNG

### 📁 Installing Icons

1. **Create directory:**
```bash
mkdir public/characters
```

2. **Name your icons:**
```
public/characters/
├── doctor-sarah.png
├── teacher-omar.png
├── chef-layla.png
├── firefighter-ahmed.png
├── police-fatima.png
└── wizard-hassan.png
```

3. **Update character store:**
In `src/store/characterStore.ts`, change:
```typescript
image: '👩‍⚕️', // Current emoji
```
To:
```typescript
image: '/characters/doctor-sarah.png', // Your icon
```

---

## 🎯 Voice Quality Improvements

### Browser TTS Enhancements

Even without external APIs, your browser TTS now has:

1. **Enhanced Arabic Voice Priority:**
   - Microsoft Arabic voices (highest priority)
   - Google Arabic voices
   - Regional voices (ar-SA, ar-EG, ar-AE)
   - Female voices for children

2. **Better Voice Settings:**
   - Character-specific voice personalities
   - Emotion-based adjustments
   - Optimized rate, pitch, and volume

3. **Smart Voice Selection:**
   - Automatically finds best available Arabic voice
   - Falls back gracefully if no Arabic voice available

### Testing Voice Quality

1. **Check available voices:**
   ```javascript
   speechSynthesis.getVoices().filter(v => 
     v.lang.includes('ar') || v.name.includes('Arabic')
   )
   ```

2. **Install better voices on Windows:**
   - Settings → Time & Language → Language
   - Add Arabic → Download speech pack

3. **Install better voices on Mac:**
   - System Preferences → Accessibility → Speech
   - Download additional voices

---

## 🚀 Quick Start (Minimum Setup)

### For Testing Right Now:
1. ✅ **Already done** - Enhanced browser TTS
2. ✅ **Already done** - Better character names with emoji icons
3. ✅ **Already done** - Improved voice selection logic

### For Production Quality:
1. **Get ElevenLabs free account** (10 min setup)
2. **Download 6 character icons** from Flaticon (20 min)
3. **Update character image paths** (5 min)

---

## 🎉 Result

With these improvements, your users will experience:

- **🎤 Much better Arabic pronunciation**
- **👥 Professional character personalities**  
- **🎨 Beautiful character icons**
- **🔄 Reliable fallback system**
- **📱 Optimized for children**

Your Arabic financial education app is now ready for professional use! 🌟 
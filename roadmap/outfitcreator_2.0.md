## 👗 **Outfit Creator 2.0 — Vision-First Outfit Creation**

### 🎯 **Goal**

Allow users to create an outfit *starting from a picture*, either by:

1. (Future AI) Automatically analyzing and linking detected clothes to wardrobe items, or
2. (Current MVP) Manually selecting or registering clothes based on that picture.

---

## 🧭 **User Flow (Step by Step)**

### 🩵 Step 1: Upload or Take a Photo

**Screen section:** “Upload an Outfit Picture”

* The user picks an image from their gallery or camera (via `expo-image-picker`).
* The photo becomes the *visual base* for the outfit.
* A preview is displayed with an option to retake or replace the picture.

✅ *Firestore draft created:*

```js
{
  id: "temp-outfit-xyz",
  image: "local_uri",
  createdAt: now(),
  status: "draft"
}
```

---

### 🤖 Step 2A: (Future) AI Analysis — *Placeholder*

**Feature toggle:** disabled by default
When enabled later:

* App sends the photo to an AI endpoint (e.g. a Vision model)
* Extracts detected clothing items (bounding boxes, categories, colors)
* Displays a visual overlay showing detected items
* For each, the user can:

  * ✅ Match with existing wardrobe item
  * ➕ Register new item (cropped from photo)
  * 💤 Skip (ignore this one)

**MVP Placeholder (now):**
Show a button like:

```jsx
<Button disabled title="AI Analyze Outfit (coming soon)" />
```

and possibly a short description:

> “This feature will automatically detect the clothes in your photo and help you link them to your wardrobe.”

---

### 🧍 Step 2B: Manual Selection (Implemented now)

**Primary active path for MVP**

The user can:

1. **Select clothes from their wardrobe** to include in this outfit

   * Uses a modal or new screen that lists wardrobe items
   * Filter by category (Tops, Bottoms, etc.)
   * Multi-select enabled (`selectedItemIds`)
2. **Or Add new clothes** using the outfit image:

   * Reuse the uploaded photo
   * Allow cropping (using e.g. `react-native-image-crop-picker` or Expo’s `ImageManipulator`)
   * Opens a quick “Add Clothes” form pre-filled with the cropped image

✅ *Firestore updated when done:*

```js
{
  name: "My Friday Outfit",
  image: "uploaded_outfit_image",
  items: ["item123", "item456"],
  previewImages: ["https://..."],
  createdAt: serverTimestamp()
}
```

---

### ✨ Step 3: Outfit Summary & Save

* Display the final outfit preview (photo + items)
* Optional: add name, notes, favorite toggle
* Confirm and save

✅ **Stored via:**
`outfitService.createOutfit(userId, outfitData)`

---

## 🧱 **Proposed UI Layout (MVP)**

**`OutfitCreatorScreen.js`**

| Section             | Description                                              |
| ------------------- | -------------------------------------------------------- |
| 🖼️ Header          | “Create a New Outfit”                                    |
| 📸 Image Upload     | Image picker (camera/gallery)                            |
| 🤖 AI Placeholder   | Disabled button + short description                      |
| 👕 Manual Selection | Button: “Select Clothes” → opens wardrobe picker modal   |
| 🧵 Add New Clothes  | Button: “Add New Clothes from Picture” (crop & register) |
| 🏁 Save Section     | Input: outfit name + Save button                         |

---

## 🔧 **Technical Architecture**

| Layer                                    | Responsibility                     |
| ---------------------------------------- | ---------------------------------- |
| **UI (`OutfitCreatorScreen.js`)**        | Manages picture, selections, form  |
| **Component (`WardrobePickerModal.js`)** | Multi-select wardrobe items        |
| **Service (`outfitService.js`)**         | Handles outfit creation logic      |
| **Service (`wardrobeService.js`)**       | Adds new clothes, updates stats    |
| **Future (`aiService.js`)**              | Placeholder for AI image detection |
| **Storage (`Firebase Storage`)**         | For uploaded pictures              |

---

## 💭 **Design & UX Enhancements (Suggestions)**

* **Progress indicator** → small step tracker (“1. Upload photo”, “2. Select clothes”, “3. Save outfit”)
* **Smart defaults** → outfit name = date by default (`"Outfit - Nov 9"`)
* **Image preview background** → blurred version of the outfit photo
* **AI placeholder badge** → gray card with info icon (“Coming soon: auto-detect clothes”)
* **Consistency** → Reuse your existing `ScreenLayout` and `TopBar` components for navigation continuity

---

## 🔮 **Future-Proof Extensions**

| Feature                | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| 🧠 AI Analysis         | Use Vision model to detect items (bounding boxes + category) |
| 🪄 Auto-link           | Suggest wardrobe matches based on color/type                 |
| ✂️ Smart Cropping      | Automatically extract items from outfit image                |
| 🧾 Outfit Tags         | Auto-generate tags (“Casual”, “Winter”) based on AI insights |
| 🌤️ Weather context    | Suggest clothes that fit current weather                     |
| 🧍 Virtual try-on (v3) | AI overlay to preview outfit combinations                    |

---

Would you like me to now:

1. ✍️ Write a **detailed functional breakdown + component structure** for implementing this screen (showing props, states, hooks, and navigation)?
   or
2. 💻 Generate the **actual scaffold code for `OutfitCreatorScreen.js` (MVP version)** with all the placeholders and the working manual flow?

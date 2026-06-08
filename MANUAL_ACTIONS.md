# Manual Actions Required — Phase 1

These are the steps that cannot be automated by code changes. Work through these in order — some unblock others.

---

## 1. Firebase Console

### 1a. Firestore Security Rules

The file `firestore.rules` will be committed to the repo by the agents. You still need to **deploy** it:

```
firebase deploy --only firestore:rules
```

If you do not have the Firebase CLI installed:

```
npm install -g firebase-tools
firebase login
firebase use closet-app-df6be
firebase deploy --only firestore:rules
```

The rules lock every user to their own `/users/{userId}/**` subtree. Without deploying them, any authenticated user can read/write any other user's data.

### 1b. Firestore Composite Index

`TrackUsageScreen` queries `dailyLogs` ordered by `timestamp` desc. Firestore requires a composite index for `orderBy` on a field that is not `__name__`. Create it in the Firebase Console:

- **Collection**: `users/{userId}/dailyLogs`
- **Fields**: `timestamp` (Descending)
- **Query scope**: Collection

Alternatively, run the app once — Firestore will print a direct link to create the missing index in the Expo logs.

### 1c. Firebase Storage — CORS and rules

The Storage bucket is `closet-app-df6be.firebasestorage.app`. Verify that the default Storage Security Rules allow authenticated users to read/write their own folder:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy with: `firebase deploy --only storage`

### 1d. Enable Email/Password Auth provider

In the Firebase Console → Authentication → Sign-in method, confirm that **Email/Password** is enabled. It was used in Phase 1 but may not have been explicitly enabled in the console.

---

## 2. Environment Variables (Optional but Recommended)

The Firebase config is currently hardcoded in `src/services/firebase.js`. Web Firebase API keys are not secrets (they are public), but if you want to move them to env vars for hygiene:

1. Create a `.env` file at the project root (it is already git-ignored):
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAnBo-irnmA30OvYCuQ7oV6FBfGfO8HMlU
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=closet-app-df6be.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=closet-app-df6be
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=closet-app-df6be.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=297287821159
   EXPO_PUBLIC_FIREBASE_APP_ID=1:297287821159:web:b272230285664fa2b3b1c2
   ```
2. Update `src/services/firebase.js` to read from `process.env.EXPO_PUBLIC_*`.
3. This is deferred from Phase 0 and is low-priority — skip if not needed now.

---

## 3. Expo / EAS

### 3a. EAS Build (if building for device)

An `eas.json` is already in the repo. To build:

```
npx eas build --platform android --profile development
```

No additional console setup is required for development builds unless you need push notifications (Phase 3).

### 3b. expo-image-manipulator (image compression)

The Phase 1 wardrobe upload adds image compression before uploading to Storage. The package `expo-image-manipulator` is already part of the Expo SDK — no separate install needed. If you get a "module not found" error, run:

```
npx expo install expo-image-manipulator
```

---

## 4. Smoke Test Checklist (manual, after code is deployed)

Run through this after all code changes are committed and the app boots:

- [ ] Sign up with a new email → lands on Home screen (not Auth loop)
- [ ] Add a wardrobe item with a photo → photo uploads and appears in the list
- [ ] Edit a wardrobe item → changes persist after navigating away
- [ ] Delete a wardrobe item → item disappears from list
- [ ] Create an outfit (upload photo → select items → name it → save) → appears in Outfits screen
- [ ] Log today's outfit → Home screen widget updates
- [ ] Open TrackUsageScreen → real stats appear (not empty placeholder)
- [ ] Sign out from Settings → returns to Auth screen

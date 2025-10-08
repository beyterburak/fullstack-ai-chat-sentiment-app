# 📱 Chat Sentiment Mobile App

React Native mobile application with real-time AI-powered sentiment analysis.

## ✨ Features

- 💬 Real-time chat messaging
- 🤖 AI-powered sentiment analysis (Positive 😊 / Neutral 😐 / Negative 😢)
- 👥 Multi-user support with authentication
- 🎨 Modern UI with Tailwind CSS (NativeWind)
- ⚡ Fast performance with Hermes engine

## 🛠️ Tech Stack

- **React Native** 0.82.0 (CLI)
- **React Navigation** 7.x
- **NativeWind** (Tailwind CSS for React Native)
- **Axios** for API calls
- **AsyncStorage** for local data
- **React Native Gesture Handler** for smooth interactions

## 📋 Prerequisites

- **Node.js** 18+
- **Java** 17 (Eclipse Adoptium)
- **Android Studio** with Android SDK
- **Android NDK** 27.1
- **Gradle** 9.0.0

## � Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Setup Environment

Create `.env` file:

```bash
# Development (local backend)
API_URL=http://10.0.2.2:7211/api
WS_URL=ws://10.0.2.2:7211/chat
ENV=development

# Production (deployed backend)
API_URL=https://fullstack-ai-chat-sentiment-app.onrender.com/api
WS_URL=wss://fullstack-ai-chat-sentiment-app.onrender.com/chat
ENV=production
```

### 3. Run the App

```bash
# Start Metro bundler
npm start

# Run on Android (separate terminal)
npm run android
```

## 📱 Building APK

### Debug APK (for testing)

```bash
# Create production JS bundle
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/

# Build APK
cd android
.\gradlew assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (for Play Store)

```bash
cd android
.\gradlew bundleRelease

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Note:** Release build requires shorter project path due to Windows path length limitations. Consider moving project to `C:\rn\` or similar short path.

```bash
# Run on iOS simulator or connected device
npm run ios
# or
yarn ios
```

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
## 📂 Project Structure

```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ChatRoom.jsx
│   │   ├── Login.jsx
│   │   ├── MessageInput.jsx
│   │   └── MessageList.jsx
│   └── services/       # API & business logic
│       └── api.js
├── android/            # Android native code
├── .env               # Environment variables (gitignored)
├── .env.production    # Production environment template
├── App.jsx            # Root component
└── package.json       # Dependencies
```

## 🧪 Testing

```bash
# Test registration
# Username: testuser
# Password: test123

# Test messaging
# Send any message to see AI sentiment analysis
```

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Build Errors

```bash
# Clean build
cd android
.\gradlew clean

# Reinstall dependencies
cd ..
rm -rf node_modules
npm install
```

### "Runtime not ready" Error

This was fixed by adding gesture handler imports. If you see this:
1. Check `index.js` has `import 'react-native-gesture-handler'` at the top
2. Rebuild the app: `npm run android`

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | Backend API endpoint | `https://your-api.com/api` |
| `WS_URL` | WebSocket URL (future) | `wss://your-api.com/chat` |
| `TIMEOUT` | API timeout (ms) | `30000` |
| `POLLING_INTERVAL` | Message refresh rate | `5000` |
| `ENABLE_LOGS` | Console logging | `false` |
| `ENV` | Environment name | `production` |

## 🔐 Release Signing

Located at: `android/app/my-release-key.keystore`

**Credentials (stored in `gradle.properties`):**
- Alias: `my-key-alias`
- Password: `android123`

⚠️ **Keep credentials secure in production!**

## 🚀 Deployment

### Google Play Store

1. Build release AAB:
   ```bash
   cd android
   .\gradlew bundleRelease
   ```

2. Upload to Play Console:
   - Location: `android/app/build/outputs/bundle/release/app-release.aab`
   - Sign with upload key in Play Console

### Direct APK Distribution

1. Build and share APK:
   ```bash
   # Build
   npm run build:apk
   
   # Share via WhatsApp/Email/Cloud
   # Location: android/app/build/outputs/apk/debug/app-debug.apk
   ```

## 🤝 Contributing

This mobile app is part of the fullstack AI chat sentiment analyzer project.

## 📄 License

MIT License - see main repo for details

## 🔗 Links

- **Backend API:** [fullstack-ai-chat](../backend)
- **Frontend Web:** [fullstack-ai-chat](../frontend)
- **Live Demo:** https://fullstack-ai-chat-sentiment-app.onrender.com

---

**Built with ❤️ using React Native**
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

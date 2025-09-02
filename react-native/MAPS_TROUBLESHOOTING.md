# Troubleshooting Google Maps Build Errors

## Common Errors and Solutions

### 1. `Execution failed for task ':react-native-maps:compileDebugJavaWithJavac'`

**Solution:**
- Pastikan Java 8 compatibility sudah ditambahkan di `android/app/build.gradle`:
  ```gradle
  compileOptions {
      sourceCompatibility JavaVersion.VERSION_1_8
      targetCompatibility JavaVersion.VERSION_1_8
  }
  ```

### 2. Java Installation Issues

**Solution:**
- Pastikan symlink Java sudah benar:
  ```bash
  sudo ln -sf /usr/lib/jvm/java-17-openjdk-amd64 /usr/lib/jvm/openjdk-17
  ```

### 3. Google Maps API Key Missing

**Solution:**
- Dapatkan API Key dari Google Cloud Console
- Ganti placeholder di `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="YOUR_ACTUAL_API_KEY_HERE" />
  ```

### 4. Build Cache Issues

**Solution:**
- Clean build project:
  ```bash
  cd android
  ./gradlew clean
  cd ..
  npm run android
  ```

### 5. Permission Issues

**Pastikan permission sudah ditambahkan di AndroidManifest.xml:**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### 6. React Native Maps Version Compatibility

**Jika masih error, coba install versi tertentu:**
```bash
npm uninstall react-native-maps
npm install react-native-maps@1.7.1 --legacy-peer-deps
```

### 7. Manual Linking (Jika diperlukan)

**Untuk React Native < 0.60:**
```bash
react-native link react-native-maps
```

## Testing Maps Functionality

1. **Pastikan emulator memiliki Google Play Services**
2. **Test dengan API Key placeholder terlebih dahulu**
3. **Jika maps blank, pastikan API Key valid dan Maps SDK aktif**

## Fallback Solution

Jika semua gagal, pertimbangkan untuk menggunakan WebView dengan Google Maps embed sebagai alternatif.

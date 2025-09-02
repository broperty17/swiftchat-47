# Setup Google Maps untuk Aplikasi BropertyAi

## Langkah-langkah Setup

### 1. Dapatkan Google Maps API Key
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan Google Maps SDK for Android
4. Buat API Key dengan restrictions yang sesuai
5. Copy API Key yang dihasilkan

### 2. Konfigurasi AndroidManifest.xml
Ganti `YOUR_GOOGLE_MAPS_API_KEY_HERE` di file `android/app/src/main/AndroidManifest.xml` dengan API Key yang valid:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="API_KEY_ANDA_DISINI" />
```

### 3. Konfigurasi untuk iOS (jika diperlukan)
Untuk iOS, tambahkan konfigurasi berikut di `ios/SwiftChat/AppDelegate.mm`:

```objective-c
#import <GoogleMaps/GoogleMaps.h>

// Di dalam didFinishLaunchingWithOptions
[GMSServices provideAPIKey:@"API_KEY_ANDA_DISINI"];
```

### 4. Build Aplikasi
Setelah mengatur API Key, build aplikasi kembali:

```bash
cd react-native
npm run android
```

## Permission yang Diperlukan
Aplikasi sudah memiliki permission berikut:
- `INTERNET` - untuk mengakses Google Maps services
- `ACCESS_FINE_LOCATION` - untuk mendapatkan lokasi pengguna
- `ACCESS_COARSE_LOCATION` - untuk mendapatkan lokasi perkiraan

## Testing
1. Pastikan emulator atau device memiliki Google Play Services
2. Test functionality maps dengan klik tombol "MAPS" di footer
3. Pastikan marker properti muncul dan dapat diklik

## Troubleshooting
- Jika maps tidak muncul: pastikan API Key valid dan Maps SDK aktif
- Jika build gagal: pastikan Java environment sudah dikonfigurasi dengan benar
- Jika permission error: pastikan permission sudah ditambahkan di AndroidManifest.xml

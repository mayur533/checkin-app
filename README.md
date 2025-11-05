# QR Code Check-in App

A beautiful React Native mobile app built with Expo that scans QR codes for reservation check-in with smooth animations.

## 🎯 Features

- **QR Code Scanner** - Full-screen camera view with overlay frame
- **Success Screen** - Beautiful green gradient with checkmark animation (3s auto-close)
- **Failed Screen** - Red gradient with error animation (3s auto-close)
- **Smooth Animations** - Scale, rotate, fade, and shake effects
- **TypeScript** - Full type safety
- **Modern UI** - Clean and professional design

## 📱 Screenshots

The app has 3 screens:
1. **Scanner Screen** - Camera view with QR frame overlay
2. **Success Screen** - Green gradient with animated checkmark
3. **Failed Screen** - Red gradient with animated X mark

## 🚀 Installation

```bash
# Install dependencies
npm install

# Start the app
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📡 Backend API Configuration

Update the API URL in `services/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url.com/api';
```

### Expected Backend API Format

**Endpoint:** `POST /api/check-in`

**Request Body:**
```json
{
  "qrData": "SCANNED_QR_CODE_STRING"
}
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "name": "John Doe",
    "reservationId": "RES123",
    "date": "2025-11-05",
    "time": "14:00",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "message": "Check-in successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Reservation not found"
}
```

## 🛠️ Backend Example (Node.js/Express)

Here's a simple backend example:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Mock database
const reservations = {
  'QR123': {
    name: 'John Doe',
    reservationId: 'RES123',
    date: '2025-11-05',
    time: '14:00',
    email: 'john@example.com',
    phone: '+1234567890'
  }
};

app.post('/api/check-in', (req, res) => {
  const { qrData } = req.body;
  
  const reservation = reservations[qrData];
  
  if (reservation) {
    res.json({
      success: true,
      user: reservation,
      message: 'Check-in successful'
    });
  } else {
    res.json({
      success: false,
      message: 'Reservation not found'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 🧪 Testing

To test the app without a backend:

1. Modify `services/api.ts` to return mock data:

```typescript
export const checkInReservation = async (qrData: string): Promise<ApiResponse> => {
  // Mock success response
  return {
    success: true,
    user: {
      name: 'John Doe',
      reservationId: 'RES123',
      date: '2025-11-05',
      time: '14:00',
    }
  };
  
  // Or mock error response
  // return {
  //   success: false,
  //   message: 'User not found'
  // };
};
```

2. Generate a test QR code containing any text (like "TEST123")
3. Scan it with the app

## 📦 Dependencies

- **expo** - React Native framework
- **expo-camera** - Camera and QR scanning
- **expo-barcode-scanner** - QR code detection
- **expo-linear-gradient** - Beautiful gradients
- **@react-navigation/native** - Screen navigation
- **@react-navigation/native-stack** - Stack navigation
- **axios** - HTTP requests
- **nativewind** - Tailwind CSS for React Native
- **TypeScript** - Type safety

## 🎨 Customization

### Change Colors

Edit the gradient colors in `app/Success.tsx` and `app/Failed.tsx`:

```typescript
// Success screen (green)
<LinearGradient colors={['#10b981', '#059669', '#047857']}>

// Failed screen (red)
<LinearGradient colors={['#ef4444', '#dc2626', '#b91c1c']}>
```

### Change Auto-Close Timer

Edit the timeout in both screens (default 3000ms = 3 seconds):

```typescript
setTimeout(() => {
  navigation.goBack();
}, 3000); // Change this value
```

### Modify User Details Display

Edit `app/Success.tsx` to show/hide specific fields in the details card.

## 📱 Running on Physical Device

1. Install **Expo Go** app on your phone
2. Run `npm start`
3. Scan the QR code with Expo Go
4. Grant camera permissions when prompted

## 🔒 Permissions

The app requires camera permissions to scan QR codes:
- **iOS:** NSCameraUsageDescription in app.json
- **Android:** CAMERA permission in app.json

## 📝 TypeScript Types

All types are defined in `types/index.ts`:

```typescript
interface UserData {
  name: string;
  reservationId: string;
  date?: string;
  time?: string;
  email?: string;
  phone?: string;
}
```

## 🐛 Troubleshooting

**Camera not working?**
- Make sure you've granted camera permissions
- Restart the app after granting permissions
- Check that your device has a working camera

**Backend connection issues?**
- Verify the API URL in `services/api.ts`
- Make sure your backend is running
- Check network connectivity
- For local testing, use your computer's IP address (not localhost)

**Build errors?**
- Delete `node_modules` and run `npm install` again
- Clear Expo cache: `expo start -c`

## 📄 License

MIT License - feel free to use this project for any purpose!

## 🤝 Contributing

Pull requests are welcome! Feel free to improve the app.

## 💡 Future Enhancements

- Add sound effects on scan
- Vibration feedback
- Scan history
- Offline mode
- Multiple QR code formats
- Settings screen for API configuration
- Dark mode toggle

---

Built with ❤️ using Expo and React Native


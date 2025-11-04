# Stream Chat & Video Setup Guide

This guide explains how to set up Stream Chat and Stream Video for real-time messaging and video consultations in the Telehealth app.

## Overview

We're using Stream's unified platform for both chat and video features:
- **Stream Chat** - Real-time messaging between doctors and patients
- **Stream Video** - HD video consultations with built-in UI

**API Key: `cahz5hr5r6pt`**

## Prerequisites

1. Stream account (sign up at [getstream.io](https://getstream.io))
2. Your Stream API Key (already configured: `cahz5hr5r6pt`)
3. Backend (Xano) set up to generate Stream user tokens - **See XANO_STREAM_TOKENS.md for detailed setup**

## Features Implemented

### Chat Features
- ✅ Real-time messaging
- ✅ Read receipts
- ✅ Typing indicators
- ✅ Message history
- ✅ Image sharing
- ✅ Emoji reactions
- ✅ Message threads
- ✅ Online/offline status

### Video Features
- ✅ HD video calling
- ✅ Audio-only mode
- ✅ Screen sharing
- ✅ Camera switching (front/back)
- ✅ Mic and camera controls
- ✅ Call recording (optional)
- ✅ Picture-in-picture
- ✅ Network quality indicators

## Setup Steps

### 1. Stream Dashboard Configuration

1. Go to [getstream.io/dashboard](https://getstream.io/dashboard)
2. Select your app (API Key: `cahz5hr5r6pt`)
3. Navigate to **Chat** section:
   - Enable push notifications
   - Configure webhook URLs (for Xano integration)
   - Set up moderation rules (optional)

4. Navigate to **Video** section:
   - Enable video calling
   - Configure call settings (quality, recording, etc.)
   - Set up webhooks for call events

### 2. Backend Token Generation (Xano)

Stream requires server-side token generation for security. You need to create Xano endpoints that generate tokens.

**📚 For complete step-by-step instructions, see: `XANO_STREAM_TOKENS.md`**

That guide includes:
- Your actual API credentials
- Detailed Xano setup instructions
- Complete code examples
- Multiple implementation options
- Testing and troubleshooting

**Quick Summary:**

You need to create two Xano endpoints:
- `POST /stream/chat-token` - Returns chat token
- `POST /stream/video-token` - Returns video token

Both endpoints generate JWT tokens using your Stream API Secret:
- **API Secret**: `scj6n6h399xsb5b9pwq5xsetfzvndq24zv2npbr9znmxgeky5f22cajzh44ma4vy`
- Store this in Xano environment variables as `STREAM_API_SECRET`
- Use HS256 algorithm
- Set expiration time (recommended: 24 hours)

**Important:** Never expose your Stream Secret in the mobile app. Always generate tokens on the backend.

### 5. Mobile App Configuration

The app is already configured! The Stream providers are set up in `app/_layout.tsx`:

```typescript
<StreamChatProvider>
  <StreamVideoProvider>
    {/* Your app */}
  </StreamVideoProvider>
</StreamChatProvider>
```

## Usage in the App

### Starting a Chat Conversation

Use the helper function to create or get a channel:

```typescript
import { useStreamChat } from '../contexts/StreamChatContext';
import { createOrGetChannel } from '../utils/chat';

const { client } = useStreamChat();

// Create/get channel and navigate
const channel = await createOrGetChannel(
  client,
  currentUser.id,
  otherUser.id,
  otherUser.name,
  otherUser.photo
);

router.push({
  pathname: '/conversation/[channelId]',
  params: { channelId: channel.id },
});
```

### Starting a Video Call

Video calls are tied to appointments:

```typescript
// From appointment screen
router.push({
  pathname: '/consultation/[id]',
  params: { id: appointmentId },
});
```

The consultation screen will:
1. Get the appointment details
2. Create a unique call ID: `appointment_{appointmentId}`
3. Join or create the call
4. Show video UI with controls

## Development Mode

For development, the app can use Stream's development tokens (generated client-side). This is **NOT secure** for production.

The contexts (`StreamChatContext.tsx` and `StreamVideoContext.tsx`) will fall back to dev tokens if the backend endpoints fail:

```typescript
try {
  token = await streamService.getChatToken(user.id);
} catch (error) {
  // Development only - use dev token
  token = chatClient.devToken(streamUserId);
}
```

**⚠️ Remove dev token fallback before production deployment!**

## Testing

### Testing Chat

1. Create two test accounts (patient and doctor)
2. Login as patient
3. Browse doctors and view a doctor profile
4. Tap "Message" button
5. Send a message
6. Login as doctor on another device
7. See the message appear in real-time

### Testing Video

1. Book an appointment as a patient
2. Doctor approves the appointment
3. At appointment time, both users tap "Join Consultation"
4. Video call connects with audio and video

## Customization

### Chat UI Customization

Stream Chat components are fully customizable. See:
- `app/(tabs)/messages-stream.tsx` - Channel list
- `app/conversation/[channelId]-stream.tsx` - Chat screen

You can customize:
- Message bubbles
- Input field
- Channel preview
- Reactions
- Attachments

Docs: [Stream Chat React Native Customization](https://getstream.io/chat/docs/sdk/reactnative/ui-components/overview/)

### Video UI Customization

Video UI can be customized in `app/consultation/[id].tsx`:

```typescript
<StreamCall call={call}>
  <CallContent /> {/* Customize this */}
  <CallControls /> {/* Or this */}
</StreamCall>
```

Docs: [Stream Video React Native Customization](https://getstream.io/video/docs/reactnative/ui-components/overview/)

## Security Best Practices

1. **Never expose Stream Secret** - Keep it on the backend only
2. **Generate tokens server-side** - Always use Xano to generate tokens
3. **Validate users** - Ensure only authorized users can create tokens
4. **Limit token expiry** - Set reasonable expiration times (e.g., 24 hours)
5. **Moderate content** - Use Stream's moderation features to filter inappropriate content

## Production Checklist

Before going live:

- [ ] Remove development token fallbacks from code
- [ ] Implement proper backend token generation in Xano
- [ ] Test token expiration and refresh
- [ ] Enable Stream webhooks for important events
- [ ] Set up push notifications (iOS and Android)
- [ ] Configure content moderation rules
- [ ] Test video call quality on different networks
- [ ] Implement error handling for network failures
- [ ] Add analytics tracking for chat and video usage
- [ ] Set up call recording storage (if needed)

## Troubleshooting

### Chat not connecting
- Check Stream API key is correct
- Verify user token is valid
- Check network connectivity
- Look for errors in console logs

### Video not working
- Ensure camera/microphone permissions are granted
- Check video token is valid
- Verify both users are using same call ID
- Test on real devices (not simulator for video)

### Messages not appearing
- Verify channel ID is consistent
- Check both users are members of the channel
- Ensure websocket connection is active
- Look for Stream status: https://status.stream.io

## Support

- **Stream Documentation**: https://getstream.io/docs
- **Stream Community**: https://getstream.io/chat/docs/sdk/reactnative/
- **Stream Video Docs**: https://getstream.io/video/docs/reactnative/
- **Support**: support@getstream.io

## Pricing

Stream offers a free tier that includes:
- **Chat**: Up to 25 MAU (Monthly Active Users)
- **Video**: Up to 10,000 minutes/month

For production, you'll need to upgrade based on usage. See: https://getstream.io/pricing/

---

**Your Stream Credentials:**
- **API Key**: `cahz5hr5r6pt` (configured in app)
- **API Secret**: `scj6n6h399xsb5b9pwq5xsetfzvndq24zv2npbr9znmxgeky5f22cajzh44ma4vy` (backend only)

Make sure your Stream dashboard app matches these credentials.

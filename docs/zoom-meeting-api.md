# Zoom Meeting Creation API Documentation

## Overview

This API endpoint allows users to create Zoom meetings programmatically through the WeLearn application. It integrates with the Zoom API to create scheduled meetings with customizable settings.

## Endpoint

`POST /api/zoom/create-meeting`

## Implementation Details

### 1. Zoom API Integration ([src/lib/zoom.ts](cci:7://file:///d:/Rey/Binus/Semester%204/Software%20Engineering/welearn/src/lib/zoom.ts:0:0-0:0))

#### ZoomAPI Class

A singleton class that handles all Zoom API interactions. Key features include:

- **Singleton Pattern**: Ensures only one instance of the Zoom API client exists
- **Token Management**: Handles OAuth token acquisition and caching
- **Environment Variables**: Requires `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, and `ZOOM_ACCOUNT_ID`

#### Methods

1. `getAccessToken()`

   - Retrieves or refreshes Zoom access token
   - Implements token caching with expiration tracking
   - Handles OAuth authentication with client credentials

2. `createMeeting(meetingData)`
   - Creates a new Zoom meeting using the Zoom API
   - Accepts meeting configuration parameters
   - Returns meeting details including join and start URLs

### 2. API Route ([src/app/api/zoom/create-meeting/route.ts](cci:7://file:///d:/Rey/Binus/Semester%204/Software%20Engineering/welearn/src/app/api/zoom/create-meeting/route.ts:0:0-0:0))

#### Request Body

```typescript
{
  topic?: string;        // Meeting topic (optional, defaults to "New Meeting")
  start_time?: string;   // ISO 8601 formatted start time (optional, defaults to current time)
  duration?: number;     // Meeting duration in minutes (optional, defaults to 60)
  timezone?: string;     // Timezone (optional, defaults to "Asia/Jakarta")
  password?: string;     // Meeting password (optional, defaults to "123456")
}
```

#### Response

```typescript
{
  success: boolean;
  meeting?: {
    id: string;
    join_url: string;
    start_url: string;
    topic: string;
    start_time: string;
    duration: number;
  };
  error?: string;
}
```

## Error Handling

- Invalid request: Returns 400 Bad Request
- Authentication errors: Returns 500 Internal Server Error
- Meeting creation failures: Returns 500 Internal Server Error

## Security Considerations

1. OAuth 2.0 authentication with Zoom
2. Token caching to minimize API calls
3. Environment variables for sensitive credentials
4. Input validation for meeting parameters

## Usage Example

```typescript
const response = await fetch("/api/zoom/create-meeting", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    topic: "Study Session",
    start_time: "2025-05-08T17:00:00+07:00",
    duration: 90,
    timezone: "Asia/Jakarta",
    password: "study123",
  }),
});

const data = await response.json();
if (data.success) {
  console.log("Meeting created successfully:", data.meeting.join_url);
}
```

## Environment Requirements

The following environment variables must be set in [.env](cci:7://file:///d:/Rey/Binus/Semester%204/Software%20Engineering/welearn/.env:0:0-0:0):

- `ZOOM_CLIENT_ID`: Zoom API client ID
- `ZOOM_CLIENT_SECRET`: Zoom API client secret
- `ZOOM_ACCOUNT_ID`: Zoom account ID

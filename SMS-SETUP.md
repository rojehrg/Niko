# SMS Setup Guide for Exam Reminders

## Overview
This guide explains how to set up SMS notifications for exam reminders using Twilio (recommended) or alternative SMS services.

## Option 1: Twilio (Recommended)

### 1. Create a Twilio Account
- Go to [twilio.com](https://www.twilio.com) and sign up
- Verify your phone number
- Get your Account SID and Auth Token from the dashboard

### 2. Get a Twilio Phone Number
- Purchase a phone number in your country
- Note the phone number for sending SMS

### 3. Install Twilio SDK
```bash
npm install twilio
```

### 4. Update Environment Variables
Add these to your `.env.local` file:
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 5. Update the SMS Function
Replace the placeholder SMS function in `src/lib/stores/exams-store.ts`:

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMSReminder(exam: Exam) {
  try {
    const message = `📚 Exam Reminder: ${exam.title} is due ${getDaysUntil(exam.date)}. Subject: ${exam.subject}`;
    
    // Get user's phone number from your user profile/settings
    const userPhoneNumber = '+1234567890'; // Replace with actual user phone
    
    await client.messages.create({
      body: message,
      to: userPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    console.log(`SMS reminder sent for: ${exam.title}`);
  } catch (error) {
    console.error('Failed to send SMS reminder:', error);
  }
}
```

## Option 2: Alternative SMS Services

### Vonage (formerly Nexmo)
- Sign up at [vonage.com](https://www.vonage.com)
- Similar setup process to Twilio

### AWS SNS
- Use AWS Simple Notification Service
- Good for high-volume applications
- More complex setup but cost-effective

### Email Fallback
If SMS is not available, you can implement email reminders instead:

```typescript
async function sendEmailReminder(exam: Exam) {
  try {
    // Use your preferred email service (SendGrid, AWS SES, etc.)
    const message = `📚 Exam Reminder: ${exam.title} is due ${getDaysUntil(exam.date)}. Subject: ${exam.subject}`;
    
    // Send email logic here
    console.log(`Email reminder would be sent: ${message}`);
  } catch (error) {
    console.error('Failed to send email reminder:', error);
  }
}
```

## Scheduling Reminders

### Option 1: Server-side Cron Jobs
Set up a cron job to check for exams daily and send reminders:

```bash
# Check every day at 9 AM
0 9 * * * /usr/bin/node /path/to/your/reminder-script.js
```

### Option 2: Vercel Cron Jobs
If deploying on Vercel, use their cron job feature:

```typescript
// api/cron/reminders.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { useExamsStore } from '@/lib/stores/exams-store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check for exams due soon and send reminders
    const store = useExamsStore.getState();
    await store.fetchExams();
    
    const upcomingExams = store.getUpcomingExams();
    
    for (const exam of upcomingExams) {
      if (exam.reminderEnabled) {
        await store.sendReminder(exam.id);
      }
    }
    
    res.status(200).json({ message: 'Reminders processed' });
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

### Option 3: Client-side Reminders
For immediate testing, you can implement client-side reminders:

```typescript
// Check for reminders every hour
setInterval(() => {
  const now = new Date();
  const exams = useExamsStore.getState().exams;
  
  exams.forEach(exam => {
    if (exam.reminderEnabled && !exam.completed) {
      const examDate = new Date(exam.date);
      const diffHours = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (diffHours <= 24 && diffHours > 0) {
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Exam Reminder', {
            body: `${exam.title} is due ${getDaysUntil(exam.date)}`,
            icon: '/favicon.ico'
          });
        }
      }
    }
  });
}, 60 * 60 * 1000); // Check every hour
```

## Testing

1. **Local Testing**: Use console.log to see what SMS would be sent
2. **Twilio Test Mode**: Use Twilio's test credentials for development
3. **Phone Number Verification**: Test with verified phone numbers first

## Security Considerations

- Never expose API keys in client-side code
- Use environment variables for sensitive data
- Implement rate limiting for SMS sending
- Validate phone numbers before sending
- Consider implementing user consent for SMS notifications

## Cost Considerations

- Twilio: ~$0.0075 per SMS (US)
- Vonage: ~$0.006 per SMS (US)
- AWS SNS: ~$0.00645 per SMS (US)
- Consider implementing daily limits per user

## Next Steps

1. Set up your chosen SMS service
2. Update the environment variables
3. Test with a single exam reminder
4. Implement proper error handling
5. Add user phone number management to your app
6. Set up automated reminder scheduling

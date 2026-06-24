import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This token is configured in the Meta App Dashboard when setting up the webhook
const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'bizbot_secure_token_123';

// 1. Meta Webhook Verification (GET Request)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Check if a request is from Meta and the token matches
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified by Meta!');
    // Meta requires the challenge string to be sent back in plain text
    return new NextResponse(challenge, { status: 200 });
  }

  // Responds with '403 Forbidden' if verify tokens do not match
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// 2. Receiving Messages (POST Request)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp status update or a message
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0]?.value;

      if (changes?.messages) {
        const message = changes.messages[0];
        const contact = changes.contacts?.[0];
        const phoneNumberId = changes.metadata.phone_number_id;
        
        const senderPhone = message.from;
        const messageText = message.text?.body || '[Non-text message]';
        const senderName = contact?.profile?.name || 'Unknown';

        console.log(`📥 Received message from ${senderName} (${senderPhone}): ${messageText}`);

        // --- DATABASE LOGIC (Phase 2 MVP) ---
        // In a real app, we would look up the clinic by `phoneNumberId`, 
        // upsert the patient, and insert the message.

        // For now, we just insert it into the `messages` table for our mock dashboard to see
        // Assuming we have a mock clinic and patient (we will seed this data later)
        
        // 1. Find or create patient
        // 2. Insert message into Supabase
        /*
        await supabase.from('messages').insert({
          direction: 'inbound',
          content: messageText,
          meta_message_id: message.id,
          -- clinic_id and patient_id would be resolved here
        });
        */

        // 3. Trigger LLM Response (To be implemented)

        return NextResponse.json({ status: 'success' }, { status: 200 });
      }
      
      // If it's just a status update (read/delivered), acknowledge it
      return NextResponse.json({ status: 'acknowledged' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Not a WhatsApp payload' }, { status: 404 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

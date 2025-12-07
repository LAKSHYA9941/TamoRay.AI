import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/db/db';

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook received at:', new Date().toISOString());

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET is missing');
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  console.log('📋 Headers received:', {
    hasSvixId: !!svix_id,
    hasSvixTimestamp: !!svix_timestamp,
    hasSvixSignature: !!svix_signature,
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  console.log('📦 Payload received:', {
    type: payload.type,
    userId: payload.data?.id,
  });

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log('✅ Webhook verified successfully');
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('🎯 Event type:', eventType);

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;

      console.log('👤 Processing user:', {
        clerkId: id,
        email,
        firstName: first_name,
        lastName: last_name,
      });

      if (!email) {
        console.error('❌ No email found in webhook data');
        return new Response('No email found', { status: 400 });
      }

      // Upsert user in your database
      const user = await prisma.user.upsert({
        where: { clerk_id: id },
        update: {
          email: email,
          // Add any other fields you want to update
        },
        create: {
          clerk_id: id,
          email: email,
          // Set default values for other required fields
          tokens: 10, // Default tokens
          plan: 'free',
        },
      });

      console.log('✅ User upserted successfully:', {
        id: user.id,
        clerkId: user.clerk_id,
        email: user.email,
        plan: user.plan,
        tokens: user.tokens,
      });
    }

    return new Response('', { status: 200 });
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return new Response('Error processing webhook', { status: 500 });
  }
}

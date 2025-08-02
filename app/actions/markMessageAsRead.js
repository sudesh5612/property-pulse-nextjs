'use server';
import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function markMessageAsRead(messageId) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.user) {
    throw new Error('User ID is required');
  }

  const userId = sessionUser.user.id;

  const message = await Message.findById(messageId);
  if (!message) throw new Error('Message not found');

  // Verify ownership
  if (message.recipient.toString() !== userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Toggle read state
  message.read = !message.read;

  await message.save();

  // Revalidate UI path (optional)
  revalidatePath('/messages', 'page');

  return message.read;
}

export default markMessageAsRead;

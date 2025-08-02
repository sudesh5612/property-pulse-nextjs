import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

export default async function handler(req, res) {
  try {
    await connectDB();
    const sessionUser = await getSessionUser(req);
    if (!sessionUser?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = sessionUser.user.id;

    // Count messages where user is recipient AND message is unread
    const unreadCount = await Message.countDocuments({
      recipient: userId,
      read: false,  // Assuming you track read/unread with a boolean `read` field
    });

    res.status(200).json({ count: unreadCount });
  } catch (error) {
    console.error('Failed to fetch unread message count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

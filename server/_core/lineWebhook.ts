import crypto from 'crypto';
import { Express, Request, Response } from 'express';

/**
 * LINE Webhook Handler
 * ตรวจสอบ signature และประมวลผลข้อมูลจาก LINE
 */

export function verifyLineSignature(
  body: string,
  signature: string,
  channelSecret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(body)
    .digest('base64');
  
  return hash === signature;
}

export interface LineWebhookEvent {
  type: string;
  message?: {
    type: string;
    id: string;
    text?: string;
  };
  replyToken?: string;
  source?: {
    type: string;
    userId: string;
  };
  timestamp: number;
}

export interface LineWebhookBody {
  events: LineWebhookEvent[];
}

/**
 * ลงทะเบียน LINE webhook endpoint
 */
export function registerLineWebhook(app: Express) {
  app.post('/api/line/webhook', async (req: Request, res: Response) => {
    try {
      // ตรวจสอบ signature
      const signature = req.headers['x-line-signature'] as string;
      const channelSecret = process.env.LINE_CHANNEL_SECRET || '';
      
      if (!signature) {
        console.warn('[LINE Webhook] Missing X-Line-Signature header');
        return res.status(401).json({ error: 'Missing signature' });
      }

      const body = JSON.stringify(req.body);
      
      if (!verifyLineSignature(body, signature, channelSecret)) {
        console.warn('[LINE Webhook] Invalid signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // ประมวลผลข้อมูล webhook
      const webhookBody = req.body as LineWebhookBody;
      
      if (!webhookBody.events || webhookBody.events.length === 0) {
        return res.status(200).json({ success: true });
      }

      // ประมวลผลแต่ละ event
      for (const event of webhookBody.events) {
        console.log('[LINE Webhook] Event received:', {
          type: event.type,
          source: event.source?.userId,
          timestamp: event.timestamp,
        });

        // ประมวลผลตามประเภท event
        switch (event.type) {
          case 'message':
            await handleMessageEvent(event);
            break;
          case 'follow':
            await handleFollowEvent(event);
            break;
          case 'unfollow':
            await handleUnfollowEvent(event);
            break;
          case 'join':
            await handleJoinEvent(event);
            break;
          case 'leave':
            await handleLeaveEvent(event);
            break;
          case 'postback':
            await handlePostbackEvent(event);
            break;
          default:
            console.log('[LINE Webhook] Unknown event type:', event.type);
        }
      }

      // ส่งการตอบรับกลับไป LINE
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('[LINE Webhook] Error processing webhook:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}

/**
 * ประมวลผลข้อมูล message event
 */
async function handleMessageEvent(event: LineWebhookEvent) {
  try {
    const userId = event.source?.userId;
    const message = event.message;

    if (!userId || !message) return;

    console.log('[LINE Message]', {
      userId,
      messageType: message.type,
      text: message.text,
    });

    // ประมวลผลตามประเภทข้อความ
    switch (message.type) {
      case 'text':
        // ตอบกลับข้อความ
        await replyMessage(event.replyToken || '', `ขอบคุณสำหรับข้อความ: "${message.text}"`);
        break;
      case 'image':
        await replyMessage(event.replyToken || '', 'ขอบคุณสำหรับรูปภาพ');
        break;
      case 'location':
        await replyMessage(event.replyToken || '', 'ขอบคุณสำหรับตำแหน่ง');
        break;
      default:
        console.log('[LINE Message] Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('[LINE Message Handler] Error:', error);
  }
}

/**
 * ประมวลผลข้อมูล follow event
 */
async function handleFollowEvent(event: LineWebhookEvent) {
  try {
    const userId = event.source?.userId;
    console.log('[LINE Follow] User followed:', userId);

    // ส่งข้อความต้อนรับ
    if (userId) {
      await pushMessage(userId, 'ยินดีต้อนรับเข้าสู่ แก้วตานวดแผนไทย 🙏\n\nเราพร้อมให้บริการนวดรักษาถึงบ้านของคุณ');
    }
  } catch (error) {
    console.error('[LINE Follow Handler] Error:', error);
  }
}

/**
 * ประมวลผลข้อมูล unfollow event
 */
async function handleUnfollowEvent(event: LineWebhookEvent) {
  try {
    const userId = event.source?.userId;
    console.log('[LINE Unfollow] User unfollowed:', userId);
  } catch (error) {
    console.error('[LINE Unfollow Handler] Error:', error);
  }
}

/**
 * ประมวลผลข้อมูล join event
 */
async function handleJoinEvent(event: LineWebhookEvent) {
  try {
    console.log('[LINE Join] Bot joined group/room');
  } catch (error) {
    console.error('[LINE Join Handler] Error:', error);
  }
}

/**
 * ประมวลผลข้อมูล leave event
 */
async function handleLeaveEvent(event: LineWebhookEvent) {
  try {
    console.log('[LINE Leave] Bot left group/room');
  } catch (error) {
    console.error('[LINE Leave Handler] Error:', error);
  }
}

/**
 * ประมวลผลข้อมูล postback event
 */
async function handlePostbackEvent(event: LineWebhookEvent) {
  try {
    console.log('[LINE Postback] Postback event received');
  } catch (error) {
    console.error('[LINE Postback Handler] Error:', error);
  }
}

/**
 * ส่งข้อความตอบกลับ (Reply)
 */
async function replyMessage(replyToken: string, message: string) {
  try {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('[LINE Reply] Missing LINE_CHANNEL_ACCESS_TOKEN');
      return;
    }

    const response = await fetch('https://api.line.biz/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replyToken,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('[LINE Reply] Failed to send reply:', response.statusText);
    }
  } catch (error) {
    console.error('[LINE Reply] Error:', error);
  }
}

/**
 * ส่งข้อความโดยตรง (Push)
 */
export async function pushMessage(userId: string, message: string) {
  try {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('[LINE Push] Missing LINE_CHANNEL_ACCESS_TOKEN');
      return;
    }

    const response = await fetch('https://api.line.biz/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('[LINE Push] Failed to send message:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[LINE Push] Error:', error);
    return false;
  }
}

/**
 * ส่ง Flex Message
 */
export async function sendFlexMessage(userId: string, flexMessage: any) {
  try {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('[LINE Flex] Missing LINE_CHANNEL_ACCESS_TOKEN');
      return;
    }

    const response = await fetch('https://api.line.biz/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: 'flex',
            altText: flexMessage.altText || 'ข้อมูลการจอง',
            contents: flexMessage.contents,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('[LINE Flex] Failed to send flex message:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[LINE Flex] Error:', error);
    return false;
  }
}

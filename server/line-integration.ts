import axios from 'axios';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_WEBHOOK_URL = process.env.LINE_WEBHOOK_URL;

export interface LineMessage {
  type: 'text' | 'template' | 'flex';
  text?: string;
  altText?: string;
  contents?: any;
}

export interface LineUser {
  userId: string;
  displayName?: string;
  pictureUrl?: string;
}

/**
 * ส่งข้อความไป LINE
 */
export async function sendLineMessage(userId: string, message: LineMessage) {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      console.warn('[LINE] Channel Access Token not configured');
      return null;
    }

    const response = await axios.post(
      'https://api.line.biz/v2/bot/message/push',
      {
        to: userId,
        messages: [message],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('[LINE] Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[LINE] Error sending message:', error);
    throw error;
  }
}

/**
 * ส่งข้อความแจ้งเตือนการจองใหม่
 */
export async function notifyNewBooking(
  userId: string,
  bookingData: {
    customerName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
    phone: string;
    address: string;
  }
) {
  const message: LineMessage = {
    type: 'template',
    altText: 'การจองบริการใหม่',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '📋 การจองบริการใหม่',
            weight: 'bold',
            size: 'xl',
            color: '#1DB446',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: 'ชื่อลูกค้า:',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: bookingData.customerName,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: 'บริการ:',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: bookingData.serviceName,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: 'วันที่:',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: bookingData.bookingDate,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: 'เวลา:',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: bookingData.bookingTime,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: 'เบอร์โทร:',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: bookingData.phone,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: 'ที่อยู่:',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: bookingData.address,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
            ],
          },
        ],
        flex: 0,
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'link',
            height: 'sm',
            action: {
              type: 'uri',
              label: 'ยืนยันการจอง',
              uri: 'https://kaewtamass-e3oem69j.manus.space/owner-dashboard',
            },
          },
        ],
        flex: 0,
      },
    },
  };

  return sendLineMessage(userId, message);
}

/**
 * ส่งข้อความยืนยันการจองให้ลูกค้า
 */
export async function notifyBookingConfirmed(
  userId: string,
  bookingData: {
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
  }
) {
  const message: LineMessage = {
    type: 'text',
    text: `✅ การจองของคุณได้รับการยืนยันแล้ว!\n\n📋 รายละเอียด:\n• บริการ: ${bookingData.serviceName}\n• วันที่: ${bookingData.bookingDate}\n• เวลา: ${bookingData.bookingTime}\n\n⏰ หมอนวดจะมาถึงตามเวลาที่นัดหมาย\n\nขอบคุณที่ใช้บริการแก้วตานวดแผนไทย 🙏`,
  };

  return sendLineMessage(userId, message);
}

/**
 * ส่งข้อความเปลี่ยนแปลงสถานะการจอง
 */
export async function notifyBookingStatusChanged(
  userId: string,
  bookingData: {
    serviceName: string;
    status: 'confirmed' | 'completed' | 'cancelled';
  }
) {
  const statusMessages = {
    confirmed: '✅ ยืนยันแล้ว',
    completed: '🎉 เสร็จสิ้น',
    cancelled: '❌ ยกเลิก',
  };

  const message: LineMessage = {
    type: 'text',
    text: `สถานะการจองของคุณมีการเปลี่ยนแปลง\n\n📋 บริการ: ${bookingData.serviceName}\n📊 สถานะ: ${statusMessages[bookingData.status]}\n\nขอบคุณที่ใช้บริการแก้วตานวดแผนไทย 🙏`,
  };

  return sendLineMessage(userId, message);
}

/**
 * Webhook handler สำหรับรับข้อความจาก LINE
 */
export async function handleLineWebhook(body: any) {
  const events = body.events || [];

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      const messageText = event.message.text;

      console.log(`[LINE] Received message from ${userId}: ${messageText}`);

      // ตอบกลับข้อความ
      const replyMessage: LineMessage = {
        type: 'text',
        text: `ขอบคุณสำหรับข้อความของคุณ! 😊\n\nเราจะติดต่อคุณโดยเร็วที่สุด\n\n📞 สำหรับการจองบริการ: https://kaewtamass-e3oem69j.manus.space/booking`,
      };

      try {
        await axios.post(
          'https://api.line.biz/v2/bot/message/reply',
          {
            replyToken: event.replyToken,
            messages: [replyMessage],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
          }
        );
      } catch (error) {
        console.error('[LINE] Error replying to message:', error);
      }
    }
  }
}

/**
 * ตรวจสอบ Webhook Signature
 */
export function verifyLineSignature(body: string, signature: string): boolean {
  const crypto = require('crypto');
  const secret = process.env.LINE_CHANNEL_SECRET;

  if (!secret) {
    console.warn('[LINE] Channel Secret not configured');
    return false;
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');

  return hash === signature;
}

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

/**
 * LINE OA Settings Page
 * สำหรับเชื่อมต่อและตั้งค่า LINE Official Account
 */
export default function LineSettings() {
  const [channelId, setChannelId] = useState('');
  const [channelSecret, setChannelSecret] = useState('');
  const [channelAccessToken, setChannelAccessToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveSettingsMutation = trpc.line.saveSettings.useMutation();
  const testConnectionMutation = trpc.line.testConnection.useMutation();

  const webhookUrl = 'https://kaewtamass-e3oem69j.manus.space/api/line/webhook';

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} คัดลอกแล้ว`);
  };

  const handleSaveSettings = async () => {
    if (!channelId || !channelSecret || !channelAccessToken) {
      toast.error('กรุณากรอกข้อมูลทั้งหมด');
      return;
    }

    setIsSaving(true);
    try {
      await saveSettingsMutation.mutateAsync({
        channelId,
        channelSecret,
        channelAccessToken,
      });
      setIsConnected(true);
      toast.success('บันทึกการตั้งค่า LINE OA สำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ' + String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const result = await testConnectionMutation.mutateAsync({
        channelAccessToken,
      });
      toast.success(`เชื่อมต่อ LINE OA สำเร็จ (${result.botName})`);
      setIsConnected(true);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ' + String(error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">⚙️ ตั้งค่า LINE OA</h1>
          <p className="text-slate-600">เชื่อมต่อ LINE Official Account เพื่อส่งแจ้งเตือนการจองบริการ</p>
        </div>

        {/* Status Alert */}
        {isConnected ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ เชื่อมต่อ LINE OA สำเร็จแล้ว
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              ⚠️ ยังไม่ได้เชื่อมต่อ LINE OA กรุณากรอกข้อมูลด้านล่าง
            </AlertDescription>
          </Alert>
        )}

        {/* Steps Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📋 ขั้นตอนการเชื่อมต่อ</CardTitle>
            <CardDescription>ทำตามขั้นตอนด้านล่างเพื่อเชื่อมต่อ LINE OA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-900">เข้า LINE Developers</p>
                  <p className="text-sm text-slate-600">
                    ไปที่{' '}
                    <a
                      href="https://developers.line.biz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      https://developers.line.biz/ <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-900">เลือก Channel ของคุณ</p>
                  <p className="text-sm text-slate-600">เลือก "แก้วตานวดแผนไทย" หรือ Official Account ของคุณ</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium text-slate-900">ไปที่ Settings → Basic settings</p>
                  <p className="text-sm text-slate-600">คัดลอก Channel ID และ Channel Secret</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <p className="font-medium text-slate-900">ไปที่ Settings → Messaging API</p>
                  <p className="text-sm text-slate-600">คลิก "Issue" เพื่อได้ Channel Access Token</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <p className="font-medium text-slate-900">ตั้งค่า Webhook URL</p>
                  <p className="text-sm text-slate-600">ใส่ URL ด้านล่างในส่วน "Webhook settings"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhook URL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔗 Webhook URL</CardTitle>
            <CardDescription>ใส่ URL นี้ในการตั้งค่า LINE Developers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                readOnly
                className="bg-slate-50 text-slate-600"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopyToClipboard(webhookUrl, 'Webhook URL')}
                type="button"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ✓ ตรวจสอบให้แน่ใจว่าได้เปิด "Use webhook" ในการตั้งค่า LINE Developers
            </p>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 ข้อมูล LINE OA</CardTitle>
            <CardDescription>กรอกข้อมูลที่ได้จาก LINE Developers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channelId">Channel ID</Label>
              <div className="flex gap-2">
                <Input
                  id="channelId"
                  placeholder="เช่น 1234567890"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  type="password"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyToClipboard(channelId, 'Channel ID')}
                  disabled={!channelId}
                  type="button"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                ได้จาก: Settings → Basic settings → Channel ID
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelSecret">Channel Secret</Label>
              <div className="flex gap-2">
                <Input
                  id="channelSecret"
                  placeholder="เช่น abcdef1234567890abcdef1234567890"
                  value={channelSecret}
                  onChange={(e) => setChannelSecret(e.target.value)}
                  type="password"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyToClipboard(channelSecret, 'Channel Secret')}
                  disabled={!channelSecret}
                  type="button"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                ได้จาก: Settings → Basic settings → Channel Secret
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelAccessToken">Channel Access Token</Label>
              <div className="flex gap-2">
                <Input
                  id="channelAccessToken"
                  placeholder="เช่น xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={channelAccessToken}
                  onChange={(e) => setChannelAccessToken(e.target.value)}
                  type="password"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyToClipboard(channelAccessToken, 'Channel Access Token')}
                  disabled={!channelAccessToken}
                  type="button"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                ได้จาก: Settings → Messaging API → Issue Channel access token
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleTestConnection}
                variant="outline"
                disabled={!channelAccessToken || isSaving || testConnectionMutation.isPending}
                type="button"
              >
                {testConnectionMutation.isPending ? 'กำลังทดสอบ...' : '🧪 ทดสอบการเชื่อมต่อ'}
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={!channelId || !channelSecret || !channelAccessToken || isSaving || saveSettingsMutation.isPending}
                className="flex-1"
                type="button"
              >
                {isSaving || saveSettingsMutation.isPending ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่า'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">✨ ฟีเจอร์ที่ได้</CardTitle>
            <CardDescription>หลังเชื่อมต่อ LINE OA สำเร็จ</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-slate-700">ส่งแจ้งเตือนการจองใหม่ให้เจ้าของธุรกิจ</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-slate-700">ส่งข้อความยืนยันการจองให้ลูกค้า</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-slate-700">แจ้งเมื่อสถานะการจองเปลี่ยนแปลง</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-slate-700">ตอบกลับข้อความจากลูกค้า</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-slate-700">ส่งโปรโมชั่นและข้อมูลบริการ</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">❓ ความช่วยเหลือ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-slate-900">Q: ฉันจะได้รับ Channel ID ได้หรือไม่?</p>
              <p className="text-slate-600">
                A: ได้ เข้า LINE Developers → เลือก Channel → Settings → Basic settings → Channel ID
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Q: ฉันจะได้รับ Channel Access Token ได้หรือไม่?</p>
              <p className="text-slate-600">
                A: ได้ เข้า LINE Developers → Settings → Messaging API → คลิก "Issue"
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Q: ฉันจะทดสอบการเชื่อมต่อได้หรือไม่?</p>
              <p className="text-slate-600">
                A: ได้ คลิกปุ่ม "🧪 ทดสอบการเชื่อมต่อ" หลังกรอกข้อมูล
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Q: ฉันจะรับแจ้งเตือนได้หรือไม่?</p>
              <p className="text-slate-600">
                A: ได้ หลังเชื่อมต่อสำเร็จ ระบบจะส่งแจ้งเตือนไปยัง LINE OA ของคุณ
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="flex gap-2 justify-center">
          <a
            href="https://business.line.biz/th/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            📱 LINE Business
          </a>
          <span className="text-slate-400">•</span>
          <a
            href="https://developers.line.biz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            👨‍💻 LINE Developers
          </a>
          <span className="text-slate-400">•</span>
          <a
            href="https://developers.line.biz/en/docs/messaging-api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            📖 Documentation
          </a>
        </div>
      </div>
    </div>
  );
}

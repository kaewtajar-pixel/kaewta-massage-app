import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Shield, AlertCircle, MapPin } from "lucide-react";
import { useLocation } from "wouter";

export default function Security() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">ความปลอดภัยและการตรวจสอบ</h1>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* KYC Section */}
          <Card className="border-slate-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center">
                <Shield className="h-16 w-16 text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">ระบบ KYC</h2>
                <p className="text-slate-600">Know Your Customer</p>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">ยืนยันตัวตนของทุกคน</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ยืนยันตัวตนลูกค้าและหมอนวดด้วยบัตรประชาชน</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">เพื่อความโปร่งใสและติดตามตัวได้</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ป้องกันการฉ้อโกงและเพิ่มความเชื่อมั่น</span>
                  </li>
                </ul>
              </CardContent>
            </div>
          </Card>

          {/* Verification Section */}
          <Card className="border-slate-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <CardContent className="p-8 order-2 md:order-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">การตรวจสอบโดยแอดมิน</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">คัดกรองประวัติอาชญากรรม</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ตรวจสอบใบประกาศนียบัตรของหมอนวด</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ประเมินผลการให้บริการอย่างต่อเนื่อง</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ตรวจสอบการปฏิบัติตามมาตรฐาน</span>
                  </li>
                </ul>
              </CardContent>
              <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col justify-center order-1 md:order-2">
                <Shield className="h-16 w-16 text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">การตรวจสอบ</h2>
                <p className="text-slate-600">Verification Process</p>
              </div>
            </div>
          </Card>

          {/* Real-time Tracking Section */}
          <Card className="border-slate-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 flex flex-col justify-center">
                <MapPin className="h-16 w-16 text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">ระบบติดตามเวลาจริง</h2>
                <p className="text-slate-600">Real-time Tracking</p>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">ติดตามตำแหน่งและเวลา</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">บันทึกเวลาเริ่มและเสร็จสิ้นงาน (Check-in/Check-out)</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">เพื่อความปลอดภัยและคำนวณรายได้แม่นยำ</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ติดตามตำแหน่งของหมอนวดในระหว่างการให้บริการ</span>
                  </li>
                </ul>
              </CardContent>
            </div>
          </Card>

          {/* SOS Button Section */}
          <Card className="border-red-200 bg-red-50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <CardContent className="p-8 order-2 md:order-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">ปุ่ม SOS ฉุกเฉิน</h3>
                <p className="text-slate-600 mb-4">
                  ระบบแจ้งเตือนฉุกเฉินสำหรับลูกค้าและหมอนวด พร้อมส่งพิกัดตำแหน่งให้แอดมินทันที
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">กดปุ่ม SOS บน Rich Menu เพื่อแจ้งเตือนฉุกเฉิน</span>
                  </li>
                  <li className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ส่งพิกัดตำแหน่งให้แอดมินทันที</span>
                  </li>
                  <li className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">ตอบสนองอย่างรวดเร็วจากทีมแอดมิน</span>
                  </li>
                </ul>
              </CardContent>
              <div className="p-8 bg-gradient-to-br from-red-100 to-red-200 flex flex-col justify-center order-1 md:order-2">
                <AlertCircle className="h-16 w-16 text-red-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">ปุ่ม SOS</h2>
                <p className="text-slate-600">Emergency Button</p>
              </div>
            </div>
          </Card>

          {/* Therapist Verification */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>การตรวจสอบหมอนวด</CardTitle>
              <CardDescription>มาตรฐานการคัดสรรหมอนวดของเรา</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">ใบประกาศนียบัตร</h4>
                  <p className="text-slate-600 text-sm">
                    ผ่านการอบรมหลักสูตรนวดแผนไทยจากสถาบันที่เชื่อถือได้ และมีใบประกาศนียบัตรรับรอง
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">ประสบการณ์</h4>
                  <p className="text-slate-600 text-sm">
                    มีความเชี่ยวชาญและทักษะในการรักษาอาการต่างๆ จากประสบการณ์จริง
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">การตรวจสอบประวัติ</h4>
                  <p className="text-slate-600 text-sm">
                    คัดกรองประวัติอาชญากรรมและยืนยันตัวตนโดยแอดมิน
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">การประเมินผล</h4>
                  <p className="text-slate-600 text-sm">
                    ประเมินผลการให้บริการอย่างต่อเนื่องจากความพึงพอใจของลูกค้า
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-700 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">วางใจได้กับเรา</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            เรามีมาตรฐานความปลอดภัยที่เข้มงวด เพื่อให้คุณได้รับบริการที่ปลอดภัยและเชื่อถือได้
          </p>
          <Button 
            size="lg"
            className="bg-white text-emerald-700 hover:bg-slate-100 rounded-full"
            onClick={() => navigate("/booking")}
          >
            จองบริการเลย
          </Button>
        </div>
      </section>
    </div>
  );
}

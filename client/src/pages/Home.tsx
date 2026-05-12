import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MapPin, Clock, Shield, Heart, Users } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleBooking = () => {
    navigate("/booking");
  };

  const handleLineOA = () => {
    // Open LINE OA - replace with actual LINE OA ID
    window.open("https://line.me/R/ti/p/@kaewta-massage", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663353696605/e3oEM69JwWSFyxVhBTSkwb/kaewta-logo-Ja2rVsheHkgd3iNAh3Fx5V.webp" 
              alt="Kaewta Massage" 
              className="h-10 w-10"
            />
            <div>
              <h1 className="font-bold text-emerald-700">แก้วตา</h1>
              <p className="text-xs text-slate-600">นวดแผนไทย</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <a href="/services" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">บริการ</a>
            <a href="/security" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">ความปลอดภัย</a>
            <a href="/service-areas" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">พื้นที่บริการ</a>
            {isAuthenticated && (
              <a href="/booking-history" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">ประวัติการจอง</a>
            )}
            {user?.role === "owner" && (
              <a href="/owner-dashboard" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">แดชบอร์ด</a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center container mx-auto px-4 py-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">บริการนวดแผนไทยถึงบ้าน</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                นวดรักษาตรงจุด<br />
                <span className="text-emerald-700">ถึงบ้านคุณ</span>
              </h2>
            </div>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              ตอบโจทย์ความสะดวกสบาย ความเป็นส่วนตัว และคุณภาพการรักษา จากหมอนวดมืออาชีพที่ผ่านการอบรมและมีใบประกาศนียบัตร
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full"
                onClick={handleBooking}
              >
                จองบริการออนไลน์
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-700 text-emerald-700 hover:bg-emerald-50 rounded-full"
                onClick={handleLineOA}
              >
                จองผ่าน LINE OA
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-slate-900">เปิด 10:00 - 22:00</p>
                  <p className="text-xs text-slate-600">ทุกวัน</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-slate-900">พื้นที่บริการ</p>
                  <p className="text-xs text-slate-600">5-10 กม.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663353696605/e3oEM69JwWSFyxVhBTSkwb/hero-massage-cPj96eewEfbk9cD29gsbCM.webp" 
              alt="Thai Massage Service" 
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
              <p className="text-sm font-semibold text-slate-900">ราคาเพียง</p>
              <p className="text-3xl font-bold text-emerald-700">350 บาท</p>
              <p className="text-xs text-slate-600">ต่อชั่วโมง</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">ทำไมต้องเลือกแก้วตา</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              เรามอบบริการที่ครบครัน ปลอดภัย และเชื่อถือได้ สำหรับสุขภาพและความเป็นอยู่ที่ดีของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "หมอมืออาชีพ",
                description: "ผ่านการอบรมและมีใบประกาศนียบัตรรับรอง"
              },
              {
                icon: MapPin,
                title: "บริการถึงบ้าน",
                description: "ประหยัดเวลาเดินทาง สะดวกสบาย"
              },
              {
                icon: Heart,
                title: "คุณภาพการรักษา",
                description: "นวดแก้ออฟฟิศซินโดรม บำบัดผู้สูงอายุ ผ่อนคลาย"
              },
              {
                icon: Shield,
                title: "ปลอดภัยและเชื่อถือได้",
                description: "ระบบ KYC และปุ่ม SOS สำหรับความปลอดภัย"
              },
              {
                icon: Clock,
                title: "จองง่ายผ่านออนไลน์",
                description: "ฟอร์มจองบริการและ LINE OA 24 ชั่วโมง"
              },
              {
                icon: CheckCircle2,
                title: "ราคาโปร่งใส",
                description: "350 บาท/ชม. ไม่มีค่าใช้จ่ายแอบแฝง"
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-slate-200 hover:shadow-lg transition">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-emerald-600 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">พร้อมที่จะรู้สึกสดชื่น?</h3>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            จองบริการนวดรักษาของเรา และสัมผัสความแตกต่างในคุณภาพของชีวิตของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-emerald-700 hover:bg-slate-100 rounded-full"
              onClick={handleBooking}
            >
              จองบริการเลย
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-emerald-600 rounded-full"
              onClick={handleLineOA}
            >
              ติดต่อเราผ่าน LINE
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">แก้วตานวดแผนไทย</h4>
              <p className="text-sm">บริการนวดรักษาถึงบ้านในพื้นที่อำเภอเมืองนครปฐม</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">บริการ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/services" className="hover:text-white transition">บริการนวด</a></li>
                <li><a href="/booking" className="hover:text-white transition">จองบริการ</a></li>
                <li><a href="/security" className="hover:text-white transition">ความปลอดภัย</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">ติดต่อ</h4>
              <ul className="space-y-2 text-sm">
                <li>เปิด: 10:00 - 22:00 น.</li>
                <li>พื้นที่: อำเภอเมืองนครปฐม</li>
                <li><a href="#" className="hover:text-white transition">@kaewta-massage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">ช่องทางจอง</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={handleBooking} className="hover:text-white transition">ฟอร์มออนไลน์</button></li>
                <li><button onClick={handleLineOA} className="hover:text-white transition">LINE OA</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 แก้วตานวดแผนไทย. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

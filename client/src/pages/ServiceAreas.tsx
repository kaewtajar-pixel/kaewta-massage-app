import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";


export default function ServiceAreas() {
  const [, navigate] = useLocation();
  const { data: areas, isLoading } = trpc.serviceAreas.list.useQuery();

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
          <h1 className="text-2xl font-bold text-slate-900">พื้นที่บริการ</h1>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Areas Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>พื้นที่บริการของเรา</CardTitle>
                <CardDescription>เราให้บริการในพื้นที่ที่กำหนด</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
                  </div>
                ) : (
                  areas?.map((area) => (
                    <div key={area.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-slate-900">{area.name}</h3>
                          <p className="text-sm text-slate-600">
                            รัศมีบริการ: {area.radiusKm} กิโลเมตร
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            พิกัด: {parseFloat(area.latitude as any).toFixed(4)}, {parseFloat(area.longitude as any).toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">วิธีตรวจสอบพื้นที่</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">ใส่ที่อยู่ของคุณในฟอร์มจอง</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">ระบบจะตรวจสอบอัตโนมัติ</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">หากอยู่ในพื้นที่ สามารถจองได้</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-lg">เวลาทำการ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">10:00 - 22:00 น.</p>
                  <p className="text-xs text-slate-600">ทุกวัน (เปิดตลอด)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 overflow-hidden h-full">
              <CardHeader>
                <CardTitle>แผนที่บริการ</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                  <p className="text-slate-700 font-semibold mb-2">แผนที่บริการ</p>
                  <p className="text-sm text-slate-600 max-w-xs">อำเภอเมืองนครปฐม รัศมี 5-10 กิโลเมตร</p>
                  <p className="text-xs text-slate-500 mt-3">พิกัด: 13.8245°N, 100.0500°E</p>
                </div>
              </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Coverage Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">พื้นที่ครอบคลุม</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600 text-sm">
                เรามีบริการในพื้นที่อำเภอเมืองนครปฐม และปริมณฑลใกล้เคียง ในรัศมี 5-10 กิโลเมตร
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 text-sm">ตัวอย่างพื้นที่ที่ให้บริการ:</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• ตัวเมืองนครปฐม</li>
                  <li>• บ้านใหม่</li>
                  <li>• ท่าจีน</li>
                  <li>• ราชบุรี (บางพื้นที่)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">ไม่ในพื้นที่?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600 text-sm">
                หากที่อยู่ของคุณอยู่นอกพื้นที่บริการ คุณสามารถ:
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• ติดต่อเราผ่าน LINE OA เพื่อตรวจสอบ</li>
                <li>• อาจมีค่าเดินทางเพิ่มเติม</li>
                <li>• เรากำลังขยายพื้นที่บริการ</li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                onClick={() => window.open("https://line.me/R/ti/p/@kaewta-massage", "_blank")}
              >
                ติดต่อเราผ่าน LINE
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-700 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">อยู่ในพื้นที่บริการ?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            จองบริการนวดของเรา และสัมผัสความแตกต่างในคุณภาพของชีวิตของคุณ
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

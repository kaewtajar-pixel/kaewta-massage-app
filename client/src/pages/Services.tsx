import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

export default function Services() {
  const [, navigate] = useLocation();
  const { data: services, isLoading } = trpc.services.list.useQuery();

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
          <h1 className="text-2xl font-bold text-slate-900">บริการนวดของเรา</h1>
        </div>
      </nav>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-12">
        <p className="text-slate-600 mb-8 text-center max-w-2xl mx-auto">
          เลือกบริการนวดที่เหมาะสมกับความต้องการของคุณ ราคาเพียง 350 บาท/ชั่วโมง
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition border-slate-200">
                {service.imageUrl && (
                  <img 
                    src={service.imageUrl} 
                    alt={service.name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">{service.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <DollarSign className="h-5 w-5" />
                      <span>{service.price} บาท</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="h-5 w-5" />
                      <span>{service.duration} นาที</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-emerald-700 hover:bg-emerald-800"
                    onClick={() => navigate("/booking")}
                  >
                    จองบริการนี้
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Description Section */}
      <section className="bg-white py-12 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">รายละเอียดบริการ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-emerald-700">นวดแก้ออฟฟิศซินโดรม</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                บริการนวดเฉพาะสำหรับคนทำงาน เน้นการบรรเทาความตึงเครียดที่คอ บ่า ไหล่ และหลัง ซึ่งเป็นปัญหาทั่วไปของผู้ที่นั่งทำงานนาน บรรเทาอาการปวดกล้ามเนื้อและเส้นเอ็น
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-emerald-700">นวดบำบัดผู้สูงอายุ</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                บริการนวดเฉพาะสำหรับผู้สูงอายุ ด้วยมือที่อ่อนโยน แต่มีประสิทธิภาพ ฟื้นฟูสมรรถภาพกล้ามเนื้อและข้อต่อ ปรับสมดุลร่างกาย เพิ่มความยืดหยุ่นและการเคลื่อนไหว
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-emerald-700">นวดผ่อนคลายความเครียด</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                บริการนวดผ่อนคลายเพื่อบรรเทาความเครียด ปรับสมดุลจิตใจและร่างกาย ช่วยให้คุณรู้สึกสงบสุข และมีพลังมากขึ้น เหมาะสำหรับผู้ที่ต้องการการพักผ่อนแบบองค์รวม
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">พร้อมจองบริการแล้วหรือ?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            เลือกบริการที่เหมาะสมกับคุณ และจองได้ง่ายๆ ผ่านฟอร์มออนไลน์หรือ LINE OA
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

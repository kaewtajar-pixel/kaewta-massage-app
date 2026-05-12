import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, Phone, MapPin, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Booking() {
  const [, navigate] = useLocation();
  const { data: services } = trpc.services.list.useQuery();
  
  const [formData, setFormData] = useState({
    serviceId: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    bookingDate: "",
    bookingTime: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBooking = trpc.bookings.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.serviceId || !formData.customerName || !formData.customerPhone || 
        !formData.customerAddress || !formData.bookingDate || !formData.bookingTime) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (formData.customerPhone.length < 9) {
      toast.error("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const bookingDateTime = new Date(`${formData.bookingDate}T${formData.bookingTime}`);
      
      // Check if booking time is within service hours (10:00 - 22:00)
      const hour = bookingDateTime.getHours();
      if (hour < 10 || hour >= 22) {
        toast.error("เวลาบริการ: 10:00 - 22:00 น. เท่านั้น");
        return;
      }

      const result = await createBooking.mutateAsync({
        serviceId: parseInt(formData.serviceId),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        bookingDate: bookingDateTime,
        notes: formData.notes,
      });

      if (result.success) {
        toast.success("จองบริการสำเร็จ! เรากำลังตรวจสอบการจองของคุณ");
        setTimeout(() => navigate("/booking-history"), 2000);
      }
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการจองบริการ");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">จองบริการนวด</h1>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>ฟอร์มจองบริการ</CardTitle>
                <CardDescription>กรอกข้อมูลเพื่อจองบริการนวดของเรา</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="serviceId" className="text-slate-900 font-semibold">
                      เลือกบริการ *
                    </Label>
                    <Select value={formData.serviceId} onValueChange={(value) => handleSelectChange("serviceId", value)}>
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="เลือกบริการ" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name} ({service.price} บาท)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-slate-900 font-semibold">
                      ชื่อ-นามสกุล *
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="เช่น สมชาย ใจดี"
                      className="border-slate-300"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-slate-900 font-semibold">
                      เบอร์โทรศัพท์ *
                    </Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="เช่น 0812345678"
                      className="border-slate-300"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="customerAddress" className="text-slate-900 font-semibold">
                      ที่อยู่ *
                    </Label>
                    <Textarea
                      id="customerAddress"
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleInputChange}
                      placeholder="เช่น 123 ซ.สุขสวัสดิ์ ต.ท่าจีน อ.เมืองนครปฐม จ.นครปฐม"
                      className="border-slate-300 min-h-24"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="bookingDate" className="text-slate-900 font-semibold">
                      วันที่ต้องการจอง *
                    </Label>
                    <Input
                      id="bookingDate"
                      name="bookingDate"
                      type="date"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      className="border-slate-300"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <Label htmlFor="bookingTime" className="text-slate-900 font-semibold">
                      เวลาที่ต้องการจอง (10:00 - 22:00) *
                    </Label>
                    <Input
                      id="bookingTime"
                      name="bookingTime"
                      type="time"
                      value={formData.bookingTime}
                      onChange={handleInputChange}
                      className="border-slate-300"
                      min="10:00"
                      max="22:00"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-900 font-semibold">
                      หมายเหตุเพิ่มเติม
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="เช่น มีปัญหาบริเวณไหน หรือข้อมูลเพิ่มเติม"
                      className="border-slate-300 min-h-20"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg h-12 font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "กำลังจอง..." : "ยืนยันการจอง"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg">ราคาบริการ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-700">350 บาท</p>
                <p className="text-sm text-slate-600 mt-2">ต่อชั่วโมง (60 นาที)</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">เวลาทำการ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-slate-700 font-semibold">10:00 - 22:00 น.</span>
                </div>
                <p className="text-sm text-slate-600">ทุกวัน (เปิดตลอด)</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  สำคัญ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-slate-700">
                  ✓ ตรวจสอบให้แน่ใจว่าที่อยู่ของคุณอยู่ในพื้นที่บริการ
                </p>
                <p className="text-slate-700">
                  ✓ กรอกข้อมูลให้ถูกต้องและครบถ้วน
                </p>
                <p className="text-slate-700">
                  ✓ เราจะติดต่อคุณเพื่อยืนยันการจองภายใน 1 ชั่วโมง
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">ช่องทางติดต่ออื่น</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => window.open("https://line.me/R/ti/p/@kaewta-massage", "_blank")}
                >
                  จองผ่าน LINE OA
                </Button>
                <p className="text-xs text-slate-600 text-center">
                  หรือติดต่อเราผ่าน LINE เพื่อการจองที่เร็วขึ้น
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

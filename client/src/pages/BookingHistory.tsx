import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function BookingHistory() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: bookings, isLoading } = trpc.bookings.getByUserId.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="border-slate-200 max-w-md">
          <CardHeader>
            <CardTitle>ต้องเข้าสู่ระบบ</CardTitle>
            <CardDescription>กรุณาเข้าสู่ระบบเพื่อดูประวัติการจอง</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-emerald-700 hover:bg-emerald-800"
              onClick={() => navigate("/")}
            >
              กลับไปหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "รอการยืนยัน", variant: "secondary" },
      confirmed: { label: "ยืนยันแล้ว", variant: "default" },
      completed: { label: "เสร็จสิ้น", variant: "outline" },
      cancelled: { label: "ยกเลิก", variant: "destructive" },
    };
    return statusMap[status] || { label: status, variant: "outline" };
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
          <h1 className="text-2xl font-bold text-slate-900">ประวัติการจอง</h1>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusInfo = getStatusBadge(booking.status);
              const bookingDate = new Date(booking.bookingDate);
              
              return (
                <Card key={booking.id} className="border-slate-200 hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Status and Date */}
                      <div className="space-y-2">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {bookingDate.toLocaleDateString("th-TH")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {bookingDate.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900 text-sm">ข้อมูลลูกค้า</p>
                        <p className="text-slate-600 text-sm">{booking.customerName}</p>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{booking.customerPhone}</span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900 text-sm">ที่อยู่</p>
                        <div className="flex gap-2">
                          <MapPin className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-600 text-sm line-clamp-2">
                            {booking.customerAddress}
                          </p>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900 text-sm">หมายเหตุ</p>
                        {booking.notes ? (
                          <p className="text-slate-600 text-sm line-clamp-2">{booking.notes}</p>
                        ) : (
                          <p className="text-slate-500 text-sm italic">ไม่มีหมายเหตุ</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">ยังไม่มีประวัติการจอง</p>
              <Button 
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() => navigate("/booking")}
              >
                จองบริการเลย
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

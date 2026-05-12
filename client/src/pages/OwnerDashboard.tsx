import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function OwnerDashboard() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: bookings, isLoading } = trpc.bookings.list.useQuery();
  const { data: notifications } = trpc.notifications.getByUserId.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateBookingStatus = trpc.bookings.updateStatus.useMutation();

  if (!isAuthenticated || user?.role !== "owner") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="border-slate-200 max-w-md">
          <CardHeader>
            <CardTitle>ไม่มีสิทธิ์เข้าถึง</CardTitle>
            <CardDescription>เฉพาะเจ้าของธุรกิจเท่านั้นที่สามารถเข้าถึงแดชบอร์ดนี้ได้</CardDescription>
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

  const pendingBookings = bookings?.filter(b => b.status === "pending") || [];
  const confirmedBookings = bookings?.filter(b => b.status === "confirmed") || [];
  const completedBookings = bookings?.filter(b => b.status === "completed") || [];
  const unreadNotifications = notifications?.filter(n => !n.isRead) || [];

  const handleStatusChange = async (bookingId: number, newStatus: "confirmed" | "completed" | "cancelled") => {
    try {
      await updateBookingStatus.mutateAsync({
        id: bookingId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "รอการยืนยัน", variant: "secondary" },
      confirmed: { label: "ยืนยันแล้ว", variant: "default" },
      completed: { label: "เสร็จสิ้น", variant: "outline" },
      cancelled: { label: "ยกเลิก", variant: "destructive" },
    };
    return statusMap[status] || { label: status, variant: "outline" };
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const bookingDate = new Date(booking.bookingDate);
    const statusInfo = getStatusBadge(booking.status);

    return (
      <Card className="border-slate-200 hover:shadow-lg transition">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-900">{booking.customerName}</h3>
                <Badge variant={statusInfo.variant} className="mt-2">
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">
                  {bookingDate.toLocaleDateString("th-TH")}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {bookingDate.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4" />
                <span>{booking.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{booking.customerAddress}</span>
              </div>
            </div>

            {booking.notes && (
              <div className="bg-slate-50 p-3 rounded text-sm text-slate-600">
                <p className="font-semibold text-slate-900 mb-1">หมายเหตุ:</p>
                <p>{booking.notes}</p>
              </div>
            )}

            {booking.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange(booking.id, "confirmed")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  ยืนยัน
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleStatusChange(booking.id, "cancelled")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  ยกเลิก
                </Button>
              </div>
            )}

            {booking.status === "confirmed" && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStatusChange(booking.id, "completed")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  เสร็จสิ้น
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">แดชบอร์ดเจ้าของ</h1>
          </div>
          <div className="text-sm text-slate-600">
            สวัสดี, {user?.name}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <p className="text-slate-600 text-sm font-semibold">รอการยืนยัน</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{pendingBookings.length}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <p className="text-slate-600 text-sm font-semibold">ยืนยันแล้ว</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{confirmedBookings.length}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <p className="text-slate-600 text-sm font-semibold">เสร็จสิ้น</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{completedBookings.length}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <p className="text-slate-600 text-sm font-semibold">แจ้งเตือนใหม่</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{unreadNotifications.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              รอการยืนยัน ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              ยืนยันแล้ว ({confirmedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              เสร็จสิ้น ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
              </div>
            ) : pendingBookings.length > 0 ? (
              pendingBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <Card className="border-slate-200">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">ไม่มีการจองที่รอการยืนยัน</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {confirmedBookings.length > 0 ? (
              confirmedBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <Card className="border-slate-200">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">ไม่มีการจองที่ยืนยันแล้ว</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length > 0 ? (
              completedBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <Card className="border-slate-200">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">ไม่มีการจองที่เสร็จสิ้น</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

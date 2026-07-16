import { useState, useEffect } from "react";
import authService from "../auth/services/auth.service";
import customerService from "../customers/services/customer.service";
import serviceService from "../services/services/service.service";
import transOrderService from "../transactions/services/trans_order.service";

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const role = user?.level_name || "Admin";

  const [stats, setStats] = useState({
    customersCount: 0,
    servicesCount: 0,
    salesTotal: 0,
    activeOrdersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        let customers = [];
        let services = [];
        let orders = [];

        if (role === "Admin" || role === "Operator") {
          const resCust = await customerService.getAllCustomers();
          if (resCust.success) customers = resCust.data;
          
          const resServ = await serviceService.getAllServices();
          if (resServ.success) services = resServ.data;
        }

        if (role === "Admin" || role === "Operator" || role === "Pimpinan") {
          const resOrders = await transOrderService.getAllOrders();
          if (resOrders.success) orders = resOrders.data;
        }

        const activeOrders = orders.filter((o) => o.order_status === 0);
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.order_total || 0), 0);

        setStats({
          customersCount: customers.length,
          servicesCount: services.length,
          salesTotal: totalRevenue,
          activeOrdersCount: activeOrders.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [role]);

  return (
    <div className="font-sans">
      <div className="bg-background rounded-lg p-6 shadow-sm border border-border mb-8">
        <h1 className="text-3xl font-bold text-foreground">Selamat Datang, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Anda masuk sebagai <span className="font-semibold text-primary">{role}</span>. Berikut ringkasan aktivitas sistem laundry hari ini.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">Memuat statistik dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Admin & Operator Stats */}
          {(role === "Admin" || role === "Operator") && (
            <>
              <div className="bg-background p-6 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase">Total Pelanggan</p>
                  <p className="text-3xl font-extrabold text-foreground mt-2">{stats.customersCount}</p>
                </div>
                <div className="mt-4 text-xs text-primary font-semibold">Pelanggan Terdaftar</div>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase">Transaksi Aktif (Antrean)</p>
                  <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.activeOrdersCount}</p>
                </div>
                <div className="mt-4 text-xs text-amber-600 font-semibold">Status: Baru</div>
              </div>
            </>
          )}

          {/* Admin only stats */}
          {role === "Admin" && (
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase">Jenis Layanan Jasa</p>
                <p className="text-3xl font-extrabold text-foreground mt-2">{stats.servicesCount}</p>
              </div>
              <div className="mt-4 text-xs text-primary font-semibold">Master Jasa & Tarif</div>
            </div>
          )}

          {/* Admin & Pimpinan Stats */}
          {(role === "Admin" || role === "Pimpinan") && (
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase">Total Pendapatan</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                  Rp {stats.salesTotal.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="mt-4 text-xs text-emerald-600 font-semibold">Omset Penjualan Terakumulasi</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

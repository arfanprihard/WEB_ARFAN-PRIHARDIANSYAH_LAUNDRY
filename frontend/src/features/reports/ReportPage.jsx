import { useState, useEffect } from "react";
import transOrderService from "../transactions/services/trans_order.service";

const ReportPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetail = async (order) => {
    setSelectedOrderDetail(order);
    setShowDetailModal(true);
    setLoadingDetails(true);
    setDetailItems([]);
    try {
      const res = await transOrderService.getOrderDetailsByOrderId(order.id);
      if (res.success) {
        setDetailItems(res.data);
      }
    } catch (err) {
      console.error("Failed to load order details", err);
    } finally {
      setLoadingDetails(false);
    }
  };
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalQty: 0,
    totalTrx: 0,
    completedTrx: 0,
    activeTrx: 0,
  });

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await transOrderService.getAllOrders();
      if (res.success) {
        setOrders(res.data);

        // Summarize
        const sales = res.data.reduce((sum, o) => sum + Number(o.order_total || 0), 0);
        const qty = res.data.reduce((sum, o) => sum + Number(o.order_qty || 0), 0);
        const completed = res.data.filter((o) => o.order_status === 1).length;
        const active = res.data.filter((o) => o.order_status === 0).length;

        setSummary({
          totalSales: sales,
          totalQty: qty,
          totalTrx: res.data.length,
          completedTrx: completed,
          activeTrx: active,
        });
      }
    } catch (err) {
      console.error("Failed to fetch sales reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="font-sans">
      <h1 className="font-bold text-3xl mb-8 text-foreground">Laporan Penjualan Laundry</h1>

      {loading ? (
        <div className="text-center py-10">Memuat laporan penjualan...</div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Total Pendapatan (Omset)</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                Rp {summary.totalSales.toLocaleString("id-ID")}
              </p>
              <div className="text-xs text-muted-foreground mt-2">Dari seluruh pesanan tersimpan</div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Total Volume Cucian</p>
              <p className="text-3xl font-extrabold text-foreground mt-2">{summary.totalQty} kg</p>
              <div className="text-xs text-muted-foreground mt-2">Akumulasi berat pakaian masuk</div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Rasio Status Pengambilan</p>
              <div className="flex gap-4 items-baseline mt-2">
                <span className="text-2xl font-extrabold text-emerald-600">{summary.completedTrx} Diambil</span>
                <span className="text-muted-foreground text-sm">/</span>
                <span className="text-lg font-bold text-amber-600">{summary.activeTrx} Antrean</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Total Transaksi: {summary.totalTrx}</div>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="bg-muted p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Detail Riwayat Transaksi Penjualan</h3>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">Belum ada transaksi terekam.</div>
            ) : (
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="py-3 px-6">Kode Order</th>
                    <th className="py-3 px-6">Nama Pelanggan</th>
                    <th className="py-3 px-6">Layanan</th>
                    <th className="py-3 px-6">Tanggal</th>
                    <th className="py-3 px-6">Berat</th>
                    <th className="py-3 px-6">Total Tagihan</th>
                    <th className="py-3 px-6">Bayar</th>
                    <th className="py-3 px-6">Kembalian</th>
                    <th className="py-3 px-6 text-center">Pembayaran</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-6 font-mono font-semibold text-xs">{o.order_code}</td>
                      <td className="py-3 px-6 font-medium">{o.customer_name}</td>
                      <td className="py-3 px-6 text-xs text-muted-foreground max-w-[200px] truncate" title={o.service_names}>
                        {o.service_names || "-"}
                      </td>
                      <td className="py-3 px-6 text-xs text-muted-foreground">
                        {o.order_date ? new Date(o.order_date).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="py-3 px-6">{o.order_qty} kg</td>
                      <td className="py-3 px-6 font-semibold">
                        Rp {Number(o.order_total).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-6">
                        Rp {Number(o.total || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-6 text-xs text-muted-foreground">
                        Rp {Number(o.order_change || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            o.payment_status === "Lunas"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {o.payment_status || "Lunas"}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            o.order_status === 0
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {o.order_status === 0 ? "Baru" : "Sudah Diambil"}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleViewDetail(o)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded cursor-pointer transition-all"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Order Detail Modal */}
      {showDetailModal && selectedOrderDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg border border-border w-full max-w-2xl overflow-hidden">
            <div className="bg-muted p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg text-foreground">
                Detail Transaksi {selectedOrderDetail.order_code}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Summary Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-muted/40 p-4 rounded-md border border-border">
                <div>
                  <p className="text-muted-foreground font-medium">Pelanggan:</p>
                  <p className="font-semibold text-foreground mt-0.5">{selectedOrderDetail.customer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Tanggal:</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {selectedOrderDetail.order_date
                      ? new Date(selectedOrderDetail.order_date).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Total Berat:</p>
                  <p className="font-semibold text-foreground mt-0.5">{selectedOrderDetail.order_qty} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Total Tagihan:</p>
                  <p className="font-bold text-emerald-600 mt-0.5">
                    Rp {Number(selectedOrderDetail.order_total).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Uang Bayar:</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    Rp {Number(selectedOrderDetail.total || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Kembalian:</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    Rp {Number(selectedOrderDetail.order_change || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Status Bayar:</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    selectedOrderDetail.payment_status === "Lunas"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {selectedOrderDetail.payment_status || "Lunas"}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Status Pengambilan:</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    selectedOrderDetail.order_status === 0
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {selectedOrderDetail.order_status === 0 ? "Baru" : "Sudah Diambil"}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="py-2 px-4">Nama Layanan</th>
                      <th className="py-2 px-4">Harga/kg</th>
                      <th className="py-2 px-4">Berat (Qty)</th>
                      <th className="py-2 px-4">Subtotal</th>
                      <th className="py-2 px-4">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground">
                    {loadingDetails ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-muted-foreground">
                          Memuat rincian layanan...
                        </td>
                      </tr>
                    ) : detailItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-muted-foreground">
                          Tidak ada detail layanan ditemukan.
                        </td>
                      </tr>
                    ) : (
                      detailItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="py-2 px-4 font-medium">{item.service_name}</td>
                          <td className="py-2 px-4">
                            Rp {Number(item.price || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-2 px-4">{item.qty} kg</td>
                          <td className="py-2 px-4 font-semibold text-emerald-600">
                            Rp {Number(item.amount || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-2 px-4 text-xs text-muted-foreground">
                            {item.notes || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md text-sm font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;

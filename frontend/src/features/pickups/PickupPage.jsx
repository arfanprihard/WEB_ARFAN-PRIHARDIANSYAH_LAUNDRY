import { useState, useEffect } from "react";
import transOrderService from "../transactions/services/trans_order.service";
import pickupService from "./services/pickup.service";
import Swal from "sweetalert2";

const PickupPage = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Detail Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Inline Pickup Detail States
  const [pickupDetails, setPickupDetails] = useState([]);
  const [loadingPickupDetails, setLoadingPickupDetails] = useState(false);

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

  // Form states
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [error, setError] = useState("");

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const res = await transOrderService.getAllOrders();
      if (res.success) {
        const unpicked = res.data.filter((o) => o.order_status === 0);
        setActiveOrders(unpicked);
      }
    } catch (err) {
      console.error("Failed to load active orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const handleOpenPickup = async (order) => {
    setSelectedOrder(order);
    setPickupDate(new Date().toISOString().slice(0, 10));
    setNotes("Diambil oleh customer");
    setAmountPaid("");
    setError("");
    setShowModal(true);
    setLoadingPickupDetails(true);
    setPickupDetails([]);
    try {
      const res = await transOrderService.getOrderDetailsByOrderId(order.id);
      if (res.success) {
        setPickupDetails(res.data);
      }
    } catch (err) {
      console.error("Failed to load pickup details", err);
    } finally {
      setLoadingPickupDetails(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedOrder) return;

    // Validate that pickup date is not before today
    const todayStr = new Date().toISOString().slice(0, 10);
    if (pickupDate < todayStr) {
      setError("Tanggal diambil tidak boleh kurang dari tanggal hari ini.");
      return;
    }

    const isUnpaid = selectedOrder.payment_status === "Belum Lunas";
    const billAmount = Number(selectedOrder.order_total);

    if (isUnpaid) {
      if (!amountPaid || isNaN(Number(amountPaid)) || Number(amountPaid) < billAmount) {
        setError("Jumlah uang yang dibayarkan tidak mencukupi total tagihan.");
        return;
      }
    }

    const payload = {
      id_order: selectedOrder.id,
      id_customer: selectedOrder.id_customer,
      pickup_date: pickupDate,
      notes: notes || null,
    };

    if (isUnpaid) {
      payload.amount_paid = Number(amountPaid);
      payload.order_change = Number(amountPaid) - billAmount;
    }

    try {
      const res = await pickupService.createPickup(payload);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pakaian berhasil diambil.",
          timer: 1500,
          showConfirmButton: false,
        });
        setShowModal(false);
        fetchActiveOrders();
      } else {
        setError(res.message || "Gagal memproses pengambilan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada server.");
    }
  };

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-3xl text-foreground">
          Antrean Pengambilan Pakaian (Pickups)
        </h1>
      </div>

      <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Memuat antrean laundry...</div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">Semua cucian sudah diambil (Antrean kosong!).</div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="py-3 px-6">Kode Order</th>
                <th className="py-3 px-6">Nama Pelanggan</th>
                <th className="py-3 px-6">Layanan</th>
                <th className="py-3 px-6">Tanggal Masuk</th>
                <th className="py-3 px-6">Berat</th>
                <th className="py-3 px-6">Total Biaya</th>
                <th className="py-3 px-6 text-center">Pembayaran</th>
                <th className="py-3 px-6 text-center w-52">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {activeOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-6 font-mono font-bold text-xs text-primary">{order.order_code}</td>
                  <td className="py-3 px-6 font-medium">{order.customer_name}</td>
                  <td className="py-3 px-6 text-xs text-muted-foreground max-w-[200px] truncate" title={order.service_names}>
                    {order.service_names || "-"}
                  </td>
                  <td className="py-3 px-6 text-xs text-muted-foreground">
                    {order.order_date ? new Date(order.order_date).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="py-3 px-6">{order.order_qty} kg</td>
                  <td className="py-3 px-6 font-bold text-emerald-600">
                    Rp {Number(order.order_total).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.payment_status === "Lunas"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {order.payment_status || "Lunas"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(order)}
                        className="px-3 py-1.5 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground rounded-md border border-border cursor-pointer transition-all"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenPickup(order)}
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md border border-emerald-200 cursor-pointer transition-all"
                      >
                        Proses Pengambilan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Pickup */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg border border-border w-full max-w-md overflow-hidden">
            <div className="bg-muted p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg text-foreground">Konfirmasi Pengambilan Baju</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
                  {error}
                </div>
              )}
              <div className="bg-primary/5 p-4 rounded-md border border-primary/10 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kode Order:</span>
                  <span className="font-bold text-foreground">{selectedOrder.order_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pelanggan:</span>
                  <span className="font-bold text-foreground">{selectedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layanan:</span>
                  <span className="font-bold text-foreground text-right max-w-[240px] truncate" title={selectedOrder.service_names}>
                    {selectedOrder.service_names || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tagihan:</span>
                  <span className="font-bold text-emerald-600">Rp {Number(selectedOrder.order_total).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Pembayaran:</span>
                  <span className={`font-bold ${selectedOrder.payment_status === "Lunas" ? "text-emerald-600" : "text-red-500"}`}>
                    {selectedOrder.payment_status || "Lunas"}
                  </span>
                </div>
              </div>

              {/* Itemized list inside the confirmation modal */}
              <div className="border border-border rounded-md overflow-hidden text-xs max-h-40 overflow-y-auto">
                <table className="w-full text-left border-collapse bg-background">
                  <thead className="bg-muted text-muted-foreground font-semibold border-b border-border sticky top-0">
                    <tr>
                      <th className="py-1.5 px-3">Layanan</th>
                      <th className="py-1.5 px-3 text-right">Berat</th>
                      <th className="py-1.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground">
                    {loadingPickupDetails ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted-foreground">Memuat detail...</td>
                      </tr>
                    ) : pickupDetails.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted-foreground">Detail tidak ditemukan.</td>
                      </tr>
                    ) : (
                      pickupDetails.map((item) => (
                        <tr key={item.id}>
                          <td className="py-1.5 px-3 font-medium">
                            {item.service_name}
                            {item.notes && <span className="block text-[10px] text-muted-foreground font-normal">{item.notes}</span>}
                          </td>
                          <td className="py-1.5 px-3 text-right">{item.qty} kg</td>
                          <td className="py-1.5 px-3 text-right font-semibold text-primary">Rp {Number(item.amount).toLocaleString("id-ID")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {selectedOrder.payment_status === "Belum Lunas" && (
                <div className="space-y-4 border-t border-border pt-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Jumlah Uang Dibayar *
                    </label>
                    <input
                      type="number"
                      required
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="Masukkan jumlah pembayaran"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground font-bold text-emerald-600"
                    />
                  </div>
                  <div className="flex justify-between text-sm bg-muted p-3 rounded-md border border-border">
                    <span className="text-muted-foreground font-medium">Uang Kembalian:</span>
                    <span className={`font-bold ${amountPaid && Number(amountPaid) >= Number(selectedOrder.order_total) ? "text-emerald-600" : "text-red-500"}`}>
                      {amountPaid && Number(amountPaid) >= Number(selectedOrder.order_total)
                        ? `Rp ${(Number(amountPaid) - Number(selectedOrder.order_total)).toLocaleString("id-ID")}`
                        : "Uang Kurang"}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tanggal Diambil *
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Catatan Pengambilan
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Diambil oleh ibu ybs"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-muted-foreground rounded-md text-sm font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-semibold cursor-pointer"
                >
                  Selesaikan & Ambil
                </button>
              </div>
            </form>
          </div>
        </div>
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
                  <p className="font-bold text-primary mt-0.5">
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
  );
};

export default PickupPage;

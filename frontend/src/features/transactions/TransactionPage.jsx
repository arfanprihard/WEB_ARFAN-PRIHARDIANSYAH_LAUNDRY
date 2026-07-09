import { useState, useEffect } from "react";
import customerService from "../customers/services/customer.service";
import serviceService from "../services/services/service.service";
import transOrderService from "./services/trans_order.service";

const TransactionPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
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

  // Quick Customer Modal
  const [showCustModal, setShowCustModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustAddress, setNewCustAddress] = useState("");

  // Transaction form states
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedMetodePembayaran, setSelectedMetodePembayaran] = useState("");
  const [cart, setCart] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const resOrders = await transOrderService.getAllOrders();
      const resCusts = await customerService.getAllCustomers();
      const resServs = await serviceService.getAllServices();

      if (resOrders.success) setOrders(resOrders.data);
      if (resCusts.success) setCustomers(resCusts.data);
      if (resServs.success) setServices(resServs.data);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      alert("Nama pelanggan wajib diisi.");
      return;
    }

    try {
      const res = await customerService.createCustomer({
        customer_name: newCustName,
        phone: newCustPhone || null,
        address: newCustAddress || null,
      });

      if (res.success) {
        const resCusts = await customerService.getAllCustomers();
        if (resCusts.success) {
          setCustomers(resCusts.data);
          setSelectedCustomerId(res.data.insertId);
        }
        setShowCustModal(false);
        setNewCustName("");
        setNewCustPhone("");
        setNewCustAddress("");
      }
    } catch (err) {
      alert("Gagal menyimpan customer.");
    }
  };

  const handleSelectService = (service) => {
    const existingIndex = cart.findIndex(
      (item) => item.id_service === service.id,
    );
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].qty += 1;
      newCart[existingIndex].amount =
        newCart[existingIndex].qty * newCart[existingIndex].price;
      setCart(newCart);
    } else {
      const newItem = {
        id_service: service.id,
        service_name: service.service_name,
        price: Number(service.price),
        qty: 1,
        amount: Number(service.price),
        notes: "",
      };
      setCart([...cart, newItem]);
    }
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Calculations
  const grandTotal = cart.reduce((sum, item) => sum + item.amount, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const change = amountPaid ? Number(amountPaid) - grandTotal : 0;

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedCustomerId) {
      setError("Pilih pelanggan terlebih dahulu.");
      return;
    }
    if (cart.length === 0) {
      setError("Keranjang belanja kosong. Masukkan minimal satu layanan.");
      return;
    }
    if (!selectedMetodePembayaran) {
      setError("Pilih metode pembayaran terlebih dahulu.");
      return;
    }
    if (selectedMetodePembayaran === "pay_now") {
      if (!amountPaid || Number(amountPaid) < grandTotal) {
        setError("Jumlah uang yang dibayarkan tidak mencukupi total tagihan.");
        return;
      }
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `LAUNDRY-${dateStr}-${randomStr}`;

    const orderData = {
      id_customer: Number(selectedCustomerId),
      order_code: orderCode,
      order_qty: totalQty,
      order_total: grandTotal,
      order_change: selectedMetodePembayaran === "pay_now" ? change : 0,
      total: selectedMetodePembayaran === "pay_now" ? Number(amountPaid) : 0,
      payment_status:
        selectedMetodePembayaran === "pay_now" ? "Lunas" : "Belum Lunas",
    };

    try {
      const res = await transOrderService.createOrder(orderData, cart);
      if (res.success) {
        const savedOrderCode = res.data?.order_code || orderCode;
        setSuccessMsg(`Transaksi ${savedOrderCode} berhasil disimpan!`);
        setSelectedCustomerId("");
        setCart([]);
        setAmountPaid("");
        setSelectedMetodePembayaran("");
        fetchData();
      } else {
        setError(res.message || "Gagal menyimpan transaksi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi server.");
    }
  };

  return (
    <div className="font-sans">
      <h1 className="font-bold text-3xl mb-8 text-foreground">
        Transaksi Laundry Baru
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background rounded-lg p-6 shadow-sm border border-border space-y-4">
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">
              Informasi Transaksi
            </h3>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md p-3 text-sm">
                {successMsg}
              </div>
            )}

            {/* Customer select */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pilih Pelanggan *
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customer_name} ({c.phone || "Tidak ada telp"})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setShowCustModal(true)}
                className="px-4 py-2 border border-border hover:bg-muted text-foreground text-sm font-semibold rounded-md cursor-pointer transition-all"
              >
                + Customer
              </button>
            </div>

            {/* Choose Service Section */}
            <div className="border-t border-border pt-4">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Pilih Layanan (Klik untuk tambah ke keranjang)
              </label>
              {services.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Tidak ada layanan tersedia.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectService(s)}
                      className="p-3 rounded-lg border border-border bg-background hover:bg-muted/50 text-left cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          {s.service_name}
                        </p>
                        {s.description && (
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                            {s.description}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-primary font-bold mt-2">
                        Rp {Number(s.price).toLocaleString("id-ID")}/kg
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Table */}
          <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="bg-muted p-4 border-b border-border">
              <h4 className="font-bold text-foreground">
                Detail Jasa Laundry (Keranjang)
              </h4>
            </div>
            {cart.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Belum ada item dalam keranjang. Silakan pilih layanan di atas.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="py-2 px-6">Nama Layanan</th>
                    <th className="py-2 px-6">Harga/kg</th>
                    <th className="py-2 px-6 w-28">Berat (kg)</th>
                    <th className="py-2 px-6">Subtotal</th>
                    <th className="py-2 px-6">Catatan</th>
                    <th className="py-2 px-6 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {cart.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="py-3 px-6 font-medium">
                        {item.service_name}
                      </td>
                      <td className="py-3 px-6">
                        Rp {item.price.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-6">
                        <input
                          type="number"
                          step="1"
                          min="1"
                          value={item.qty}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const newCart = [...cart];
                            newCart[index].qty = val;
                            newCart[index].amount = val * newCart[index].price;
                            setCart(newCart);
                          }}
                          className="w-20 px-2 py-1 border border-border rounded text-sm bg-background text-foreground font-semibold text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </td>
                      <td className="py-3 px-6 font-bold text-primary">
                        Rp {item.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-6">
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => {
                            const newCart = [...cart];
                            newCart[index].notes = e.target.value;
                            setCart(newCart);
                          }}
                          placeholder="Tambah catatan..."
                          className="w-full px-2 py-1 border border-border rounded text-xs bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-red-500 hover:text-red-700 cursor-pointer font-bold"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Checkout panel */}
        {/* <div className="bg-background rounded-lg p-6 shadow-sm border border-border flex flex-col justify-between h-fit">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">
              Metode Pembayaran
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Berat:</span>
                <span className="font-semibold text-foreground">
                  {totalQty} kg
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total Tagihan:</span>
                <span className="text-primary">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <label className="block text-sm font-medium text-foreground mb-1">
                Jumlah Uang Dibayar *
              </label>
              <input
                type="number"
                required
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-bold text-lg text-emerald-600 bg-background"
              />
            </div>

            <div className="flex justify-between text-sm bg-muted p-3 rounded-md border border-border">
              <span className="text-muted-foreground font-medium">
                Uang Kembalian:
              </span>
              <span
                className={`font-bold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}
              >
                {change >= 0
                  ? `Rp ${change.toLocaleString("id-ID")}`
                  : "Uang Kurang"}
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveTransaction}
            className="w-full mt-6 py-3 px-4 bg-primary hover:bg-opacity-90 text-primary-foreground font-bold rounded-md shadow-md cursor-pointer transition-all"
          >
            Simpan Transaksi (Status: Baru)
          </button>
        </div> */}
        <div className="bg-background rounded-lg p-6 shadow-sm border border-border flex flex-col justify-between h-fit">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">
              Metode Pembayaran
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Berat:</span>
                <span className="font-semibold text-foreground">
                  {totalQty} kg
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total Tagihan:</span>
                <span className="text-primary">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <select
              value={selectedMetodePembayaran}
              onChange={(e) => setSelectedMetodePembayaran(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
            >
              <option value="">-- Pilih Metode Pembayaran --</option>
              <option value="pay_now">Bayar Sekarang</option>
              <option value="pay_later">Bayar Nanti</option>
            </select>
          </div>

          {selectedMetodePembayaran == "pay_now" ? (
            <div>
              <div className="border-t border-border pt-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Jumlah Uang Dibayar *
                </label>
                <input
                  type="number"
                  required
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-bold text-lg text-emerald-600 bg-background"
                />
              </div>

              <div className="flex justify-between text-sm bg-muted p-3 rounded-md border border-border mt-3">
                <span className="text-muted-foreground font-medium">
                  Uang Kembalian:
                </span>
                <span
                  className={`font-bold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {change >= 0
                    ? `Rp ${change.toLocaleString("id-ID")}`
                    : "Uang Kurang"}
                </span>
              </div>
              <button
                onClick={handleSaveTransaction}
                className="w-full mt-6 py-3 px-4 bg-primary hover:bg-opacity-90 text-primary-foreground font-bold rounded-md shadow-md cursor-pointer transition-all"
              >
                Simpan Transaksi (Status: Baru)
              </button>
            </div>
          ) : (
            <button
              onClick={handleSaveTransaction}
              className="w-full mt-6 py-3 px-4 bg-primary hover:bg-opacity-90 text-primary-foreground font-bold rounded-md shadow-md cursor-pointer transition-all"
            >
              Simpan
            </button>
          )}
        </div>
      </div>

      {/* Bottom Table: Recent Transactions */}
      <div className="mt-12 bg-background rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="bg-muted p-4 border-b border-border">
          <h3 className="font-bold text-foreground">
            Riwayat Transaksi Terbaru
          </h3>
        </div>
        {loading ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            Memuat riwayat transaksi...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            Belum ada transaksi terekam.
          </div>
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
                <tr key={o.id} className="hover:bg-muted/50">
                  <td className="py-3 px-6 font-mono font-bold text-xs">
                    {o.order_code}
                  </td>
                  <td className="py-3 px-6 font-medium">{o.customer_name}</td>
                  <td
                    className="py-3 px-6 text-xs text-muted-foreground max-w-[200px] truncate"
                    title={o.service_names}
                  >
                    {o.service_names || "-"}
                  </td>
                  <td className="py-3 px-6 text-xs text-muted-foreground">
                    {o.order_date
                      ? new Date(o.order_date).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="py-3 px-6">{o.order_qty} kg</td>
                  <td className="py-3 px-6 font-semibold">
                    Rp {Number(o.order_total).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-6">
                    Rp {Number(o.total).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-6 text-xs text-muted-foreground">
                    Rp {Number(o.order_change).toLocaleString("id-ID")}
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
                      className="px-3 py-1 bg-primary hover:bg-opacity-95 text-primary-foreground text-xs font-semibold rounded cursor-pointer transition-all"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inline Quick Customer Modal */}
      {showCustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg border border-border w-full max-w-md overflow-hidden">
            <div className="bg-muted p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg text-foreground">
                Tambah Customer Baru
              </h3>
              <button
                onClick={() => setShowCustModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nama Customer *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="Masukkan nama"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  No. Telepon
                </label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="081xxxxxxxxxx"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Alamat
                </label>
                <textarea
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="Masukkan alamat"
                  rows="3"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCustModal(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-muted-foreground rounded-md text-sm font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-opacity-90 text-primary-foreground rounded-md text-sm font-semibold cursor-pointer"
                >
                  Simpan Baru
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
                        <td
                          colSpan="5"
                          className="text-center py-6 text-muted-foreground"
                        >
                          Memuat rincian layanan...
                        </td>
                      </tr>
                    ) : detailItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-muted-foreground"
                        >
                          Tidak ada detail layanan ditemukan.
                        </td>
                      </tr>
                    ) : (
                      detailItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="py-2 px-4 font-medium">
                            {item.service_name}
                          </td>
                          <td className="py-2 px-4">
                            Rp {Number(item.price || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-2 px-4">{item.qty} kg</td>
                          <td className="py-2 px-4 font-semibold text-primary">
                            Rp{" "}
                            {Number(item.amount || 0).toLocaleString("id-ID")}
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

export default TransactionPage;

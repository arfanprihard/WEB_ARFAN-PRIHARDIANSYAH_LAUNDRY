import { useState, useEffect } from "react";
import customerService from "./services/customer.service";
import authService from "../auth/services/auth.service";
import { ROLE_PERMISSIONS } from "../../config/roles";
import Swal from "sweetalert2";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState("");

  const user = authService.getCurrentUser();
  const role = user?.level_name || "Operator";
  const canWrite = ROLE_PERMISSIONS.customers.includes(role);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.getAllCustomers();
      if (res.success) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setName("");
    setPhone("");
    setAddress("");
    setValidationError("");
    setShowModal(true);
  };

  const handleOpenEdit = (cust) => {
    setIsEdit(true);
    setCurrentId(cust.id);
    setName(cust.customer_name);
    setPhone(cust.phone || "");
    setAddress(cust.address || "");
    setValidationError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim()) {
      setValidationError("Nama Pelanggan wajib diisi.");
      return;
    }

    const payload = {
      customer_name: name,
      phone: phone || null,
      address: address || null,
    };

    try {
      let res;
      if (isEdit) {
        res = await customerService.updateCustomerById(currentId, payload);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data pelanggan berhasil diperbarui.",
            timer: 1500,
            showConfirmButton: false,
          });
          setShowModal(false);
          fetchCustomers();
        } else {
          setValidationError(res.message || "Operation failed.");
        }
      } else {
        res = await customerService.createCustomer(payload);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Pelanggan baru berhasil ditambahkan.",
            timer: 1500,
            showConfirmButton: false,
          });
          setShowModal(false);
          fetchCustomers();
        } else {
          setValidationError(res.message || "Operation failed.");
        }
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data pelanggan ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await customerService.deleteCustomerById(id);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Data pelanggan berhasil dihapus.",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchCustomers();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus pelanggan. Mungkin data pelanggan ini masih terikat dengan data transaksi.",
        });
      }
    }
  };

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-3xl text-foreground">
          Kelola Pelanggan (Customer)
        </h1>
        {canWrite ? (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-primary hover:bg-opacity-90 text-primary-foreground font-semibold rounded-md text-[14px] cursor-pointer transition-all"
          >
            Tambah Pelanggan Baru
          </button>
        ) : null}
      </div>

      <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Memuat data pelanggan...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">Tidak ada data pelanggan ditemukan.</div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="py-3 px-6 w-16">#</th>
                <th className="py-3 px-6">Nama</th>
                <th className="py-3 px-6">Nomor Telepon</th>
                <th className="py-3 px-6">Alamat</th>
                <th className="py-3 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {customers.map((cust, index) => (
                <tr key={cust.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-6 font-semibold">{index + 1}</td>
                  <td className="py-3 px-6 font-medium">{cust.customer_name}</td>
                  <td className="py-3 px-6">{cust.phone || "-"}</td>
                  <td className="py-3 px-6">{cust.address || "-"}</td>
                  <td className="py-3 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        disabled={!canWrite}
                        className="px-3 py-1 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary rounded-md border border-primary/20 cursor-pointer transition-all disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id)}
                        disabled={!canWrite}
                        className="px-3 py-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 cursor-pointer transition-all disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Input/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg border border-border w-full max-w-md overflow-hidden">
            <div className="bg-muted p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg text-foreground">
                {isEdit ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
                  {validationError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama pelanggan"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081xxxxxxxxxx"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Alamat
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  rows="3"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-muted-foreground rounded-md text-sm font-semibold cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-opacity-90 text-primary-foreground rounded-md text-sm font-semibold cursor-pointer transition-all"
                >
                  {isEdit ? "Simpan Perubahan" : "Simpan Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;

import { useState, useEffect } from "react";
import userService from "./services/user.service";
import authService from "../auth/services/auth.service";
import Swal from "sweetalert2";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idLevel, setIdLevel] = useState("2"); // Default to Operator (2)
  const [validationError, setValidationError] = useState("");

  const activeUser = authService.getCurrentUser();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setName("");
    setEmail("");
    setPassword("");
    setIdLevel("2");
    setValidationError("");
    setShowModal(true);
  };

  const handleOpenEdit = (usr) => {
    setIsEdit(true);
    setCurrentId(usr.id);
    setName(usr.name);
    setEmail(usr.email);
    setPassword(""); // Keep blank unless updating
    setIdLevel(String(usr.id_level));
    setValidationError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim()) {
      setValidationError("Nama wajib diisi.");
      return;
    }
    if (!email.trim()) {
      setValidationError("Email wajib diisi.");
      return;
    }
    if (!isEdit && !password.trim()) {
      setValidationError("Password wajib diisi untuk user baru.");
      return;
    }

    const payload = {
      id_level: Number(idLevel),
      name: name,
      email: email,
    };

    if (password.trim() !== "") {
      payload.password = password;
    }

    try {
      let res;
      if (isEdit) {
        res = await userService.updateUserById(currentId, payload);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data pengguna berhasil diperbarui.",
            timer: 1500,
            showConfirmButton: false,
          });
          setShowModal(false);
          fetchUsers();
        } else {
          setValidationError(res.message || "Operation failed.");
        }
      } else {
        res = await userService.createUser(payload);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Pengguna baru berhasil ditambahkan.",
            timer: 1500,
            showConfirmButton: false,
          });
          setShowModal(false);
          fetchUsers();
        } else {
          setValidationError(res.message || "Operation failed.");
        }
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (id === activeUser.id) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data pengguna ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await userService.deleteUserById(id);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Data pengguna berhasil dihapus.",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchUsers();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus pengguna.",
        });
      }
    }
  };

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-3xl text-foreground">
          Kelola Pengguna (User Management)
        </h1>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-primary hover:bg-opacity-90 text-primary-foreground font-semibold rounded-md text-[14px] cursor-pointer transition-all"
        >
          Tambah User Baru
        </button>
      </div>

      <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Memuat data pengguna...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">Tidak ada data user ditemukan.</div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="py-3 px-6 w-16">#</th>
                <th className="py-3 px-6">Nama Lengkap</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Level / Peran</th>
                <th className="py-3 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {users.map((usr, index) => (
                <tr key={usr.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-6 font-semibold">{index + 1}</td>
                  <td className="py-3 px-6 font-medium">{usr.name}</td>
                  <td className="py-3 px-6">{usr.email}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        usr.level_name === "Admin"
                          ? "bg-primary/10 text-primary"
                          : usr.level_name === "Operator"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {usr.level_name || "Operator"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(usr)}
                        className="px-3 py-1 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary rounded-md border border-primary/20 cursor-pointer transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(usr.id)}
                        disabled={usr.id === activeUser.id}
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
                {isEdit ? "Edit User" : "Tambah User Baru"}
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
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password {isEdit ? "(Kosongkan jika tidak diganti)" : "*"}
                </label>
                <input
                  type="password"
                  required={!isEdit}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Level / Peran Akses *
                </label>
                <select
                  value={idLevel}
                  onChange={(e) => setIdLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-background text-foreground"
                >
                  <option value="1">Administrator / Super Admin</option>
                  <option value="2">Operator / Kasir</option>
                  <option value="3">Pimpinan</option>
                </select>
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
                  className="px-4 py-2 bg-primary hover:bg-opacity-90 text-primary-foreground rounded-md text-sm font-semibold cursor-pointer"
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

export default UserPage;

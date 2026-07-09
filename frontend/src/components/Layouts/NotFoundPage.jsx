import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-6 text-center font-sans">
      <div className="max-w-md">
        <h1 className="text-9xl font-extrabold text-primary mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
          dipindahkan.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-opacity-90 transition-all shadow-md cursor-pointer"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

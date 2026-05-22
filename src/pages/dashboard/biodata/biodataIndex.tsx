export default function BiodataIndex() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header Halaman */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Biodata Mahasiswa</h1>
        <p className="text-gray-500 text-sm mt-1">Informasi lengkapnyaa</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Sisi Kiri: Foto Profil Besar */}
        <div className="flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"
            alt="Depit"
            className="w-44 h-44 object-cover rounded-2xl border border-gray-200 shadow-md"
          />
        </div>

        {/* Sisi Kanan: Detail Informasi */}
        <div className="flex-1 w-full space-y-4 text-sm">
          <div className="flex border-b border-gray-50 pb-2.5">
            <span className="w-28 font-bold text-gray-400 uppercase tracking-wider text-xs">Nama Lengkap</span>
            <span className="text-gray-800 font-semibold">: Devita Anggraeni</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2.5">
            <span className="w-28 font-bold text-gray-400 uppercase tracking-wider text-xs">NIM</span>
            <span className="text-gray-800 font-semibold">: 24090026</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2.5">
            <span className="w-28 font-bold text-gray-400 uppercase tracking-wider text-xs">Kelas</span>
            <span className="text-gray-800 font-semibold">: 4B</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2.5">
            <span className="w-28 font-bold text-gray-400 uppercase tracking-wider text-xs">Semester</span>
            <span className="text-gray-800 font-semibold">: 4 (Empat)</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2.5">
            <span className="w-28 font-bold text-gray-400 uppercase tracking-wider text-xs">Program Studi</span>
            <span className="text-gray-800 font-semibold">: D4 Teknik Informatika</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2.5">
            <span className="w-28 font-bold text-gray-400 uppercase tracking-wider text-xs">Kampus</span>
            <span className="text-gray-800 font-semibold">: Universitas Harkat Negeri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { FaBook, FaCog, FaHome, FaRegChartBar, FaThLarge } from "react-icons/fa"

const FloatSidebars = () => {
    return <>
        <ul className="menu bg-white text-blue-800 shadow-md rounded-md px-5 min-h-[98vh] sticky top-2 w-full">
            <div className="px-4 mb-10 mt-5 uppercase">
                <h1 className="text-xl font-bold">Keps Assistant</h1>
                <p>Uis Neno Nokan Kit</p>
            </div>
            <li>
                <a className="py-3 text-blue-800">
                    <FaThLarge size={15} />
                    <p>Dashboard</p>
                </a>
            </li>
            <li>
                <details>
                    <summary className="py-3 text-blue-800">
                        <FaBook size={15} />
                        <p>Buku Besar</p>
                    </summary>
                    <ul>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Jurnal Umum</p>
                            </a>
                        </li>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>History Akun</p>
                            </a>
                        </li>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Log Aktivitas</p>
                            </a>
                        </li>
                    </ul>
                </details>
            </li>
            <li>
                <details>
                    <summary className="py-3 text-blue-800">
                        <FaRegChartBar size={15} />
                        <p>Laporan</p>
                    </summary>
                    <ul>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Neraca Saldo</p>
                            </a>
                        </li>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Laba Rugi</p>
                            </a>
                        </li>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Perubahan Modal</p>
                            </a>
                        </li>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Neraca</p>
                            </a>
                        </li>
                    </ul>
                </details>
            </li>
            <li>
                <details>
                    <summary className="py-3 text-blue-800">
                        <FaCog size={15} />
                        <p>Pengaturan</p>
                    </summary>
                    <ul>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Preferensi</p>
                            </a>
                        </li>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Hak Akses</p>
                            </a>
                        </li>
                        <li>
                            <a className="py-3 text-blue-800">
                                <p>Pengguna</p>
                            </a>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    </>
}

export default FloatSidebars
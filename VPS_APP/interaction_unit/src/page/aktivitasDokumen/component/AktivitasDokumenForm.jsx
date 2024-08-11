import { FaSave, FaTimes } from "react-icons/fa";
import { getHariTanggalFull } from "../../../helper/date.helper";
import { formValidation } from "../../../helper/form.helper";
import FormInputWithLabel from "../../../component/form/FormInputWithLabel";
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel";
import { useEffect, useState } from "react";
import { inputOnlyRupiah } from "../../../helper/actionEvent.helper";
import { apiAktivitasDokumen } from "../../../service/endPointList.api";
import { pegawaiList, statusAktivitasDokumenList, tipeDokumenList } from "../../../config/objectList.config";
import RiwayatPembayaranAktivitasDokumen from "./RiwayatPembayaranAktivitasDokumen";
import RiwayatAktivitasDokumen from "./RiwayatAktivitasDokumen";
import DokumenKlien from "./DokumenKlien";
import { parseToRupiahText } from "../../../helper/number.helper";
import { useDataContext } from "../../../context/dataContext.context";

const AktivitasDokumen = ({
    setAddAktivitasDokumenEvent,
    idAktivitasDokumen,
    setIdAktivitasDokumen = () => { },
}) => {

    const { data } = useDataContext()
    const [isLoading, setIsLoading] = useState(false)
    const [hariTanggal, setHariTanggal] = useState(getHariTanggalFull())
    const [nomorSurat, setNomorSurat] = useState("Otomatis Terisi Ketika Disimpan")
    const [tipeDokumen, setTipeDokumen] = useState({
        label: tipeDokumenList[0].title,
        value: tipeDokumenList[0].title,
    })
    const [kategoriDokumen, setKategoriDokumen] = useState()
    const [jenisDokumen, setJenisDokumen] = useState()
    const [klien, setKlien] = useState("")
    const [penanggungJawab, setPenanggungJawab] = useState()
    const [biaya, setBiaya] = useState("")

    const [keteranganSurat, setKeteranganSurat] = useState("")
    const [statusAktivitasDokumen, setStatusAktivitasDokumen] = useState({
        label: "Mulai",
        value: "Mulai"
    })

    const _saveAktivitasDokumen = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            setIsLoading(x => x = true)
            const payload = {
                tanggal: hariTanggal,
                tipe_dokumen: tipeDokumen?.value,
                kategori_dokumen: kategoriDokumen?.value,
                jenis_dokumen: jenisDokumen ? jenisDokumen.value : "EMPTY",
                klien: klien,
                penanggung_jawab: penanggungJawab?.value,
                biaya: biaya,
                no_surat: nomorSurat,
                keterangan: keteranganSurat,
                status: statusAktivitasDokumen?.value,
                tahun: data?.tahun
            }

            apiAktivitasDokumen.custom(`${idAktivitasDokumen != null ? `/${idAktivitasDokumen}` : ""}`, idAktivitasDokumen != null ? "PUT" : "POST", null, {
                data: payload
            }).then((res) => {
                setIsLoading(x => x = false)
                setNomorSurat(res.data.no_surat)
                setIdAktivitasDokumen(x => x = res.data.uuid)
            })
        }
    }

    const getAktivitasDokumenById = () => {
        setIsLoading(x => x = true)
        apiAktivitasDokumen.custom(`/${idAktivitasDokumen}`, "GET")
            .then(res => {
                setIsLoading(x => x = false)
                setHariTanggal(x => x = res.data.tanggal)
                setNomorSurat(x => x = res.data.no_surat)
                setKlien(x => x = res.data.klien)
                setBiaya(x => x = parseToRupiahText(res.data.biaya))
                setKeteranganSurat(x => x = res.data.keterangan)
                setTipeDokumen(x => x = {
                    label: res.data.tipe_dokumen,
                    value: res.data.tipe_dokumen
                })
                setKategoriDokumen(x => x = {
                    label: res.data.kategori_dokumen,
                    value: res.data.kategori_dokumen
                })
                setJenisDokumen(x => x = {
                    label: res.data.jenis_dokumen,
                    value: res.data.jenis_dokumen
                })
                setPenanggungJawab(x => x = {
                    label: res.data.penanggung_jawab,
                    value: res.data.penanggung_jawab
                })
                setStatusAktivitasDokumen(x => x = {
                    label: res.data.status,
                    value: res.data.status
                })
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (idAktivitasDokumen) {
            getAktivitasDokumenById()
        }
    }, [idAktivitasDokumen])

    return <>
        <div className="bg-white rounded-md shadow-2xl h-[70vh] overflow-scroll no-scrollbar">
            <div className="py-3 relative px-6 h-max bg-white w-full z-10">
                <div className="bg-white mb-3 sticky top-0 pt-5 pb-4 z-50 flex justify-between items-center">
                    <h1 className="uppercase text-gray-600 font-bold">{null ? "Edit " : "Tambah "} Aktivitas Dokumen</h1>
                    <button
                        className="btn btn-sm bg-red-900 text-white border-none"
                        onClick={() => setAddAktivitasDokumenEvent()}
                    ><FaTimes /> Tutup
                    </button>
                </div>
                <form onSubmit={(e) => _saveAktivitasDokumen(e)}>
                    <div className="flex gap-x-2">
                        <FormInputWithLabel
                            label={"Hari/Tanggal"}
                            type={"datetime-local"}
                            onchange={(e) => {
                                setHariTanggal(e.target.value)
                            }}
                            others={
                                {
                                    value: hariTanggal,
                                    name: "hariTanggal"
                                }
                            }
                        />
                        <FormInputWithLabel
                            label={"Nomor Surat"}
                            type={"text"}
                            addClassInput="font-bold text-red-500"
                            addClassParent="border-0"
                            others={
                                {
                                    value: nomorSurat,
                                    name: "nomorSurat",
                                    disabled: true
                                }
                            }
                        />
                        <FormSelectWithLabel
                            label={"Tipe Dokumen"}
                            onchange={(e) => {
                                setTipeDokumen(e)
                            }}
                            optionsDataList={tipeDokumenList}
                            optionsLabel={"title"}
                            optionsValue={"title"}
                            selectValue={tipeDokumen}
                            selectName={"kodeAkunType"}
                        />
                    </div>
                    <div className="flex gap-x-2 mt-4">
                        <FormSelectWithLabel
                            label={"Kategori Dokumen"}
                            onchange={(e) => {
                                setKategoriDokumen(x => x = e)
                            }}
                            selectValue={kategoriDokumen}
                            optionsDataList={tipeDokumenList.filter(x => x.title == tipeDokumen?.value)[0]?.data}
                            optionsLabel={"title"}
                            optionsValue={"title"}
                            selectName={"kodeAkunType"}
                        />
                        {
                            tipeDokumenList.filter(x => x.title == tipeDokumen?.value)[0]?.data?.filter(x => x.title == kategoriDokumen?.value)[0]?.data?.length > 0 ?
                                <FormSelectWithLabel
                                    label={"Jenis Dokumen"}
                                    onchange={(e) => {
                                        setJenisDokumen(x => x = e)
                                    }}
                                    optionsDataList={tipeDokumenList.filter(x => x.title == tipeDokumen?.value)[0].data.filter(x => x.title == kategoriDokumen.label)[0].data}
                                    optionsLabel={"title"}
                                    selectValue={jenisDokumen}
                                    optionsValue={"title"}
                                    selectName={"kodeAkunType"}
                                />
                                : <></>
                        }
                    </div>
                    <div className="flex gap-x-2 mt-4">
                        <FormInputWithLabel
                            label={"Klien"}
                            type={"text"}
                            onchange={(e) => {
                                setKlien(e.target.value)
                            }}
                            others={
                                {
                                    value: klien,
                                    name: "klien"
                                }
                            }
                        />
                        <FormSelectWithLabel
                            label={"Penanggung Jawab"}
                            onchange={(e) => {
                                setPenanggungJawab(e)
                            }}
                            optionsDataList={pegawaiList}
                            selectValue={penanggungJawab}
                            optionsLabel={"nama"}
                            optionsValue={"nama"}
                            selectName={"kodeAkunType"}
                        />
                        <FormInputWithLabel
                            label={"Biaya"}
                            type={"text"}
                            onchange={(e) => {
                                inputOnlyRupiah(e)
                                setBiaya(e.target.value)
                            }}
                            others={
                                {
                                    value: biaya,
                                    name: "biaya"
                                }
                            }
                        />
                    </div>
                    <div className="flex gap-x-3 mt-4">
                        <FormInputWithLabel
                            label={"Keterangan Surat"}
                            type={"text"}
                            onchange={(e) => {
                                setKeteranganSurat(e.target.value)
                            }}
                            others={
                                {
                                    value: keteranganSurat,
                                    name: "keteranganSurat"
                                }
                            }
                        />
                    </div>
                    <div className="flex gap-x-3 mt-4">
                        <FormSelectWithLabel
                            label={"Status Aktivitas Dokumen"}
                            onchange={(e) => {
                                setStatusAktivitasDokumen(x => x = e)
                            }}
                            selectValue={statusAktivitasDokumen}
                            optionsDataList={statusAktivitasDokumenList}
                            optionsLabel={"nama"}
                            optionsValue={"nama"}
                            selectName={"kodeAkunType"}
                        />
                    </div>
                    <button
                        className="btn btn-sm bg-green-800 mt-4 text-white"
                        type="submit"
                        disabled={isLoading}
                    >
                        <FaSave /> Simpan
                    </button>
                </form>
                {
                    idAktivitasDokumen ? <>
                        <DokumenKlien
                            idAktivitasDokumen={idAktivitasDokumen}
                        />
                        <RiwayatPembayaranAktivitasDokumen
                            idAktivitasDokumen={idAktivitasDokumen}
                        />
                        <RiwayatAktivitasDokumen
                            idAktivitasDokumen={idAktivitasDokumen}
                        />
                    </> : <></>
                }
            </div>
        </div >
    </>
};

export default AktivitasDokumen;

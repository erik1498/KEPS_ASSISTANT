import Wrap from "../../../component/layout/Wrap";
import { getBulanList, getHariTanggal, statusBulanNow } from "../../../helper/date.helper";
import JurnalUmumRow from "./component/JurnalUmumRow";
import { parseToRupiahText } from "../../../helper/number.helper";
import { FaCheck, FaDownload, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { apiJurnalUmumCRUD } from "../../../service/endPointList.api";
import { normalizeDataJurnalUmum, normalizeDataJurnalUmumEdit } from "../../../helper/jurnalUmum.helper";
import JurnalUmumForm from "./component/JurnalUmumForm";
import { useDataContext } from "../../../context/dataContext.context";
import DebetKreditStatusCard from "../../../component/card/DebetKreditStatusCard";
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard";
import PageTitle from "../../../component/general/PageTitle";

const JurnalUmumPage = () => {

  const dataContext = useDataContext()
  const { data } = dataContext

  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bulan, setBulan] = useState(new Date().getMonth())
  const [debet, setDebet] = useState(0)
  const [kredit, setKredit] = useState(0)
  const [jurnalUmum, setJurnalUmum] = useState([])
  const [balanceStatus, setBalanceStatus] = useState(true)
  const [buktiTransaksiEdit, setBuktiTransaksiEdit] = useState({
    initialHariTanggal: getHariTanggal(),
    initialBuktiTransaksi: "",
    initialTransaksiList: []
  })

  const [addJurnal, setAddJurnal] = useState(false)

  const _getData = (searchParam = "") => {
    setIsLoading(true)
    if (searchParam == "") {
      setSearch(searchParam)
    }
    apiJurnalUmumCRUD
      .custom(`/bulan/${bulan + 1}/${data.tahun}/bukti_transaksi?search=${searchParam}`, "GET")
      .then(async (resData) => {
        let normalizedData = await normalizeDataJurnalUmum(resData?.data)

        setBalanceStatus(searchParam.length < 1)

        setJurnalUmum(normalizedData.returnData)
        setDebet(normalizedData.totalDebet)
        setKredit(normalizedData.totalKredit)

        setIsLoading(false)

      })
      .catch(err => {
        console.log(err)
      })
  };

  const _deleteTransaksi = async (uuid) => {
    apiJurnalUmumCRUD
      .delete(uuid)
      .then((data) => {
        _getData()
      }).catch(err => {
        console.log(err)
      })
  }

  const _deleteByBuktiTransaksi = async (buktiTransaksi) => {
    setIsLoading(true)
    apiJurnalUmumCRUD
      .custom(`/by_bukti_transaksi`, "DELETE", null, {
        data: {
          bukti_transaksi: buktiTransaksi
        }
      })
      .then(() => {
        _getData()
      }).catch(err => {
        console.log(err)
      })
  }

  const backupJurnal = () => {
    setIsLoading(true)
    apiJurnalUmumCRUD
    .custom(`/bulan/${bulan + 1}/${data.tahun}/bukti_transaksi?print=true`, "GET")
      .then(() => {
        setIsLoading(false)
      }).catch(err => {
        console.log(err)
      })
  }

  const _editTransaksi = async (buktiTransaksi) => {
    setIsLoading(true)
    setBuktiTransaksiEdit({
      buktiTransaksi: buktiTransaksi.bukti_transaksi,
      hariTanggal: `${buktiTransaksi.tahun}-${buktiTransaksi.bulan}-${buktiTransaksi.tanggal}`,
      transaksiList: await normalizeDataJurnalUmumEdit(buktiTransaksi.data, data.kodeAkun)
    })
    setAddJurnal(true)
    setIsLoading(false)
  }

  useEffect(() => {
    _getData()
  }, [bulan])

  return (
    <Wrap
      isLoading={isLoading}
    >
      <div>
        <PageTitle title={"Jurnal Umum"} />
        {
          addJurnal ?
            <JurnalUmumForm
              setAddJurnalEvent={
                () => setAddJurnal(!addJurnal)
              }
              kodeAkun={data.kodeAkun}
              buktiTransaksiEdit={buktiTransaksiEdit}
              getData={_getData}
              setIsLoadingEvent={setIsLoading}
            /> :
            <>
              <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-between shadow-2xl">
                <label className="input input-sm input-bordered flex items-center gap-2 bg-white">
                  <input type="text" className="grow bg-transparent" placeholder="Cari" value={search} onChange={(e) => setSearch(e.target.value)} />
                  {
                    !balanceStatus ?
                      <FaTimes className="cursor-pointer" onClick={() => {
                        _getData("")
                      }} /> :
                      <FaSearch className="cursor-pointer" onClick={() => _getData(search)} />
                  }
                </label>
                <div>
                  <button className="btn btn-sm bg-blue-900 text-white border-none" onClick={() => {
                    setBuktiTransaksiEdit(null)
                    setAddJurnal(true)
                  }}><FaPlus /> Tambah Transaksi</button>
                </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-1">
                  <BulanSelectedListCard
                    bulan={bulan}
                    setBulan={setBulan}
                  />
                  {
                    balanceStatus ?
                      <DebetKreditStatusCard
                        debet={debet}
                        kredit={kredit}
                      /> : <></>
                  }
                  <button className="btn btn-sm hover:bg-yellow-500 bg-yellow-500 border-yellow-500 text-black my-2 shadow-xl"
                    onClick={() => backupJurnal()}
                  >
                    <FaDownload size={10} />
                    <p className="font-bold text-md">Backup Jurnal</p>
                  </button>
                </div>
                <div className="col-span-5">
                  <div className="h-[65vh] pl-2">
                    <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                      {
                        jurnalUmum.map((item, i) => {
                          return <JurnalUmumRow
                            deleteByBuktiTransaksi={_deleteByBuktiTransaksi}
                            deleteItem={_deleteTransaksi}
                            editItem={_editTransaksi}
                            item={item}
                            key={i}
                            balanceStatus={balanceStatus} />
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
        }
      </div>
    </Wrap>
  );
}

export default JurnalUmumPage;
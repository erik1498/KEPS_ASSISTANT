import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaPlus, FaPrint, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { initialKodeAkunValue } from "../../../../helper/select.helper";
import FormSelect from "../../../../component/form/FormSelect";
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel";
import { getHariTanggal } from "../../../../helper/date.helper";
import { inputOnlyRupiah } from "../../../../helper/actionEvent.helper";
import { parseRupiahToFloat, parseToRupiahText } from "../../../../helper/number.helper";
import FormInput from "../../../../component/form/FormInput";
import { apiJurnalUmumCRUD } from "../../../../service/endPointList.api";
import { formShowMessage, formValidation, showAlert, showError } from "../../../../helper/form.helper";
import { normalizeDataJurnalUmumSubmit } from "../../../../helper/jurnalUmum.helper";
import { axiosJWT } from "../../../../helper/api.helper";
import { useReactToPrint } from "react-to-print";
import { JurnalUmumFormPrint } from "./JurnalUmumFormPrint";
import { getCookie } from "../../../../helper/cookies.helper";

const JurnalUmumForm = ({
  setAddJurnalEvent,
  kodeAkun,
  buktiTransaksiEdit,
  setIsLoadingEvent = () => { },
  getData = () => { }
}) => {
  const [transaksiListDeleted, setTransaksiListDeleted] = useState([])
  const [transaksiList, setTransaksiList] = useState([
    [
      {
        waktu: `${new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()}`,
        kodeAkun: initialKodeAkunValue(),
        uraian: "",
        debet: 0,
        kredit: 0
      }
    ],
  ])

  const [totalDebetKredit, setTotalDebetKredit] = useState({
    totalDebet: [0.0],
    totalKredit: [0.0]
  })

  const [hariTanggal, setHariTanggal] = useState(getHariTanggal())
  const [buktiTransaksi, setBuktiTransaksi] = useState("")

  const [kodeAkunList, setKodeAkunList] = useState(kodeAkun)

  const addTransaksi = () => {
    let transaksiListCopy = [...transaksiList]
    transaksiListCopy.push([
      {
        waktu: `${new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()}`,
        kodeAkun: initialKodeAkunValue(),
        uraian: "",
        debet: 0,
        kredit: 0
      }
    ])
    setTransaksiList(transaksiListCopy)
  }

  const deleteTransaksi = (i) => {
    let transaksiListCopy = [...transaksiList]
    let transaksiListDelete = [...transaksiListDeleted]
    transaksiListCopy.at(i).map(i => {
      if (i.uuid) {
        transaksiListDelete.push(i)
      }
    })
    setTransaksiListDeleted(transaksiListDelete)
    transaksiListCopy.splice(i, 1)
    setTransaksiList(transaksiListCopy)
  }

  const addingTransaksiList = (i) => {
    let transaksiListCopy = [...transaksiList]
    setTransaksiList([])
    transaksiListCopy[i].push({
      waktu: `${new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()}`,
      kodeAkun: initialKodeAkunValue(),
      uraian: "",
      debet: 0,
      kredit: 0
    })
    setTransaksiList(transaksiListCopy)
  }

  const deleteTransaksiList = (i, j) => {
    let transaksiListCopy = [...transaksiList]
    let transaksiListDelete = [...transaksiListDeleted]
    if (transaksiListCopy[i].at(j).uuid) {
      transaksiListDelete.push(transaksiListCopy[i].at(j))
    }
    setTransaksiListDeleted(transaksiListDelete)
    setTransaksiList([])
    transaksiListCopy[i].splice(j, 1)
    setTransaksiList(transaksiListCopy)
  }

  const _saveTransaksi = async (transaksiList) => {
    if (await formValidation()) {
      let transaksiListNormalized = await normalizeDataJurnalUmumSubmit(transaksiList, buktiTransaksiEdit, transaksiListDeleted)
      let transaksiUpdateDelete = transaksiListNormalized.filter(j => j.status != "POST")
      transaksiUpdateDelete.map((item) => {
        let { status, ...itemCopy } = item
        let uuidList = transaksiUpdateDelete.filter(i => i.uuid != undefined).map(i => `'${i.uuid}'`)
        itemCopy.uuidList = uuidList.length > 0 ? uuidList.join(",") : "EMPTY"
        apiJurnalUmumCRUD
          .custom(`/${itemCopy.uuid}`, status, null, status == "PUT" ? {
            data: itemCopy
          } : null)
          .then(() => {
            getData()
          }).catch((err) => {
            showError(err)
          })
      })
      postTransaksiFromArray(0, transaksiListNormalized)
    }
  }

  const postTransaksiFromArray = async (index, transaksiListNormalized, postResponse = []) => {
    if (transaksiListNormalized[index]) {
      let { status, ...itemCopy } = transaksiListNormalized[index]
      if (status == "POST") {
        let uuidList = transaksiListNormalized.concat([...postResponse]).filter(i => i.uuid != undefined).map(i => `'${i.uuid}'`)
        itemCopy.uuidList = uuidList.length > 0 ? uuidList.join(",") : "EMPTY"
        try {
          let response = await axiosJWT.post(apiJurnalUmumCRUD.getUrlCRUD(), itemCopy)
          postResponse.push({ ...response.data.data })
          if (index + 1 < transaksiListNormalized.length) {
            postTransaksiFromArray(index + 1, transaksiListNormalized, postResponse)
          } else {
            getData()
            setAddJurnalEvent()
            showAlert("Berhasil", "Transaksi Berhasil Disimpan")
          }
        } catch (error) {
          showError(error)
        }
      } else {
        if (index + 1 < transaksiListNormalized.length) {
          postTransaksiFromArray(index + 1, transaksiListNormalized, postResponse)
        } else {
          getData()
          setAddJurnalEvent()
          showAlert("Berhasil", "Transaksi Berhasil Disimpan")
        }
      }
    }
  }

  const setTransaksiListItem = (e, i, j, name) => {
    let transaksiListCopy = [...transaksiList]
    setTransaksiList([])
    transaksiListCopy[i][j][name] = e
    setTransaksiList(transaksiListCopy)
  }


  const jurnalUmumFormPrintRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => jurnalUmumFormPrintRef.current,
  });

  useEffect(() => {
    setIsLoadingEvent(true)
    setKodeAkunList(kodeAkun)
    if (buktiTransaksiEdit != null) {
      setBuktiTransaksi(buktiTransaksiEdit.buktiTransaksi)
      setHariTanggal(buktiTransaksiEdit.hariTanggal)
      setTransaksiList(buktiTransaksiEdit.transaksiList)
    }
    setIsLoadingEvent(false)
  }, [])

  useEffect(() => {
    let totalDebet = [0.0]
    let totalKredit = [0.0]
    transaksiList.map((transaksi, i) => {
      totalDebet[i] = 0.0
      totalKredit[i] = 0.0
      transaksi.map(item => {
        totalDebet[i] += parseRupiahToFloat(item.debet)
        totalKredit[i] += parseRupiahToFloat(item.kredit)
      })
    })
    setTotalDebetKredit({
      totalDebet: parseFloat(totalDebet).toFixed(2),
      totalKredit: parseFloat(totalKredit).toFixed(2),
    })
  }, [transaksiList])

  return <>
    <div className="bg-white rounded-md shadow-2xl h-[70vh] overflow-scroll no-scrollbar relative">
      <div className="sticky top-0 pt-3 px-6 h-max bg-white w-full z-10">
        <div className="mb-3 flex justify-between items-center">
          <h1 className="uppercase text-gray-600 font-bold">{buktiTransaksiEdit != null ? "Edit " : "Tambah "} Transaksi</h1>
          <button
            className="btn btn-sm bg-red-900 text-white border-none"
            onClick={() => setAddJurnalEvent()}
          ><FaTimes /> Batalkan Transaksi
          </button>
        </div>
        <div className="flex gap-x-2">
          <FormInputWithLabel
            label={"Hari/Tanggal"}
            type={"date"}
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
            label={"Bukti Transaksi"}
            type={"text"}
            onchange={(e) => {
              setBuktiTransaksi(e.target.value)
            }}
            others={
              {
                value: buktiTransaksi,
                name: "buktiTransaksi"
              }
            }
          />
        </div>
      </div>
      <div className="flex flex-col px-6 mt-6 w-full">
        {
          transaksiList.map((transaksi, i) => {
            return <>
              <div className="w-full">
                <label className="form-control w-full max-w-xs bg-white">
                  <div className="label">
                    <span className="flex items-center gap-x-2 label-text text-gray-800 font-bold mt-4">
                      <p>Transaksi {i + 1}</p>
                      <div className="px-2 py-2 rounded-full bg-red-900 cursor-pointer" onClick={() => deleteTransaksi(i)}>
                        <FaTrash className="text-white" />
                      </div>
                    </span>
                  </div>
                </label>

                <div className="grid w-full grid-cols-12 gap-x-2 border-b-2">
                  <div className="col-span-1">
                    <label className="form-control w-full max-w-xs bg-white">
                      <div className="label">
                        <span className="label-text text-gray-600">Waktu</span>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="form-control w-full max-w-xs bg-white">
                      <div className="label">
                        <span className="label-text text-gray-600">Kode Akun</span>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-5">
                    <label className="form-control w-full max-w-xs bg-white">
                      <div className="label">
                        <span className="label-text text-gray-600">Uraian</span>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="form-control w-full max-w-xs bg-white">
                      <div className="label">
                        <span className="label-text text-gray-600">Debet</span>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="form-control w-full max-w-xs bg-white">
                      <div className="label">
                        <span className="label-text text-gray-600">Kredit</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="grid w-full items-end grid-cols-12 gap-x-2">
                  {
                    transaksi.map((item, j) => {
                      return <>
                        <div className="mt-5 col-span-1">
                          <FormInput
                            name={`waktu_${j}`}
                            type={"time"}
                            value={item.waktu}
                            onchange={(e) => setTransaksiListItem(e.target.value, i, j, `waktu`)}
                            other={
                              {
                                autoComplete: false,
                                step: 1
                              }
                            }
                          />
                        </div>
                        <div className="mt-5 col-span-3">
                          <FormSelect
                            optionsDataList={kodeAkunList}
                            optionsLabel={["code", "name"]}
                            optionsValue={"uuid"}
                            optionsLabelIsArray={true}
                            optionsDelimiter={"-"}
                            selectValue={item.kodeAkun}
                            onchange={(e) => {
                              setTransaksiListItem(e, i, j, 'kodeAkun')
                            }}
                            addClass={parseRupiahToFloat(item.kredit) > 0 ? "text-right" : ""}
                            selectName={`kodeAkun_${j}`}
                          />
                        </div>
                        <div className="mt-5 col-span-4">
                          <FormInput
                            name={`uraian_${j}`}
                            type={"text"}
                            value={item.uraian}
                            onchange={(e) => setTransaksiListItem(e.target.value, i, j, `uraian`)}
                            other={
                              {
                                autoComplete: false
                              }
                            }
                          />
                        </div>
                        <div className="mt-5 col-span-2">
                          <FormInput
                            name={`debet_${j}`}
                            type={"text"}
                            value={parseToRupiahText(item.debet)}
                            onchange={(e) => {
                              inputOnlyRupiah(e)
                              setTransaksiListItem(0, i, j, `kredit`)
                              setTransaksiListItem(e.target.value, i, j, `debet`)
                            }}
                            other={
                              {
                                autoComplete: false,
                              }
                            }
                          />
                        </div>
                        <div className="mt-5 col-span-2">
                          <div className="w-full indicator">
                            <span className="indicator-item indicator-bottom badge bg-red-800 text-white px-2 py-4 cursor-pointer" onClick={() => deleteTransaksiList(i, j)}><FaTrash /></span>
                            <FormInput
                              name={`kredit_${j}`}
                              type={"text"}
                              value={parseToRupiahText(item.kredit)}
                              onchange={(e) => {
                                inputOnlyRupiah(e)
                                setTransaksiListItem(0, i, j, `debet`)
                                setTransaksiListItem(e.target.value, i, j, `kredit`)
                              }}
                              other={
                                {
                                  autoComplete: false,
                                }
                              }
                            />
                          </div>
                        </div>
                      </>
                    })
                  }
                  <div className="mt-5 col-span-4">
                    {
                      getCookie("demo_permission") && transaksi.length < 2 ? <>
                        <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addingTransaksiList(i)}><FaPlus /> Tambah</button>
                      </> : <>
                        <p className="text-red-500 font-bold text-xs">* Hanya Mengijinkan 2 Inputan Dalam Mode Demo</p>
                      </>
                    }
                  </div>
                  <div className="mt-5 col-span-4 text-right">
                    <h1 className={`text-md ${totalDebetKredit.totalDebet[i] == totalDebetKredit.totalKredit[i] ? `text-green-600` : `text-red-600`} font-bold mt-1`}>Total ( {totalDebetKredit.totalDebet[i] == totalDebetKredit.totalKredit[i] ? `Seimbang` : `Tidak Seimbang`} )</h1>
                  </div>
                  <div className="mt-5 col-span-2 font-bold">
                    <FormInput
                      border={false}
                      name={`totalDebet`}
                      type={"text"}
                      value={parseToRupiahText(totalDebetKredit.totalDebet[i])}
                      other={
                        {
                          autoComplete: false,
                          disabled: true
                        }
                      }
                    />
                  </div>
                  <div className="mt-5 col-span-2 font-bold">
                    <FormInput
                      border={false}
                      name={`totalKredit`}
                      type={"text"}
                      value={parseToRupiahText(totalDebetKredit.totalKredit[i])}
                      other={
                        {
                          autoComplete: false,
                          disabled: true
                        }
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          })
        }
        <div className="flex sticky bottom-0 bg-white py-3 w-full items-end gap-x-2">
          {
            getCookie("demo_permission") && transaksiList.length == 1 ? <>
              <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addTransaksi()}><FaPlus /> Tambah Transaksi</button>
            </> : <>
            </>
          }
          {
            transaksiList.length > 0 ? <>
              <button className="btn btn-sm bg-green-800 mt-4 text-white" onClick={() => {
                _saveTransaksi({
                  transaksiList,
                  hariTanggal,
                  buktiTransaksi
                })
              }}><FaSave /> Simpan</button>

              <div className="hidden">
                <JurnalUmumFormPrint
                  data={transaksiList}
                  buktiTransaksi={buktiTransaksi}
                  totalDebetKredit={totalDebetKredit}
                  tanggal={hariTanggal}
                  ref={jurnalUmumFormPrintRef}
                />
              </div>
              <button
                onClick={handlePrint}
                className="btn btn-sm bg-red-600 hover:bg-red-600 text-white mt-2 border-red-600"
              >
                <FaPrint /> Cetak Form
              </button>
            </> : <></>
          }
        </div>
      </div >
    </div>
  </>
};

export default JurnalUmumForm;

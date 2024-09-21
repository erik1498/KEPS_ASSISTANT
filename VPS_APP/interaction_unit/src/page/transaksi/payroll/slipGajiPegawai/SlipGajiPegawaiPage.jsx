import { useEffect, useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import ToggleBox from "../../../../component/general/ToggleBox"
import { showError } from "../../../../helper/form.helper"
import { apiPegawaiCRUD } from "../../../../service/endPointList.api"
import { getBulanListForFormSelect } from "../../../../helper/date.helper"
import { FaCheck, FaTimes } from "react-icons/fa"
import SlipGaji from "./component/SlipGaji"

const SlipGajiPegawaiPage = () => {
    const [isLoading, setIsLoading] = useState(false)

    const [pegawai, setPegawai] = useState()
    const [pegawaiList, setPegawaiList] = useState([])
    const [idPegawai, setIdPegawai] = useState()
    const [periode, setPeriode] = useState(getBulanListForFormSelect()[new Date().getMonth()].value)

    const [toggle, setToggle] = useState("Gaji")

    const [kodeAkunList, setKodeAkunList] = useState([])

    const _getDataPegawai = () => {
        apiPegawaiCRUD
            .custom("", "GET")
            .then(resData => {
                setPegawaiList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setPegawai({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => showError(err))
    }

    useEffect(() => {
        _getDataPegawai()
    }, [])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Slip Gaji Pegawai" />
            <div className="bg-white rounded-md shadow-2xl h-max overflow-scroll no-scrollbar relative">
                <div className="sticky top-0 py-5 px-6 h-max bg-white w-full z-10">
                    <div className="flex items-end gap-x-2">
                        <FormSelectWithLabel
                            label={"Pilih Pegawai"}
                            optionsDataList={pegawaiList}
                            optionsLabel={"name"}
                            optionsValue={"uuid"}
                            disabled={idPegawai}
                            selectValue={pegawai}
                            onchange={(e) => {
                                setPegawai(e)
                            }}
                            selectName={`pegawai`}
                        />
                    </div>
                    <div className="mt-5 flex gap-x-2">
                        <ToggleBox
                            disabled={idPegawai}
                            label="Periode"
                            labelTextSize="text-sm"
                            toggleBox={periode}
                            textSize="text-xs"
                            setToggleBox={setPeriode}
                            toggleBoxList={getBulanListForFormSelect()}
                        />
                    </div>
                    {
                        idPegawai ?
                            <button
                                className="btn btn-sm bg-red-800 text-white"
                                onClick={() => setIdPegawai(null)}
                            >
                                <FaTimes /> Reset Pegawai Dan Periode
                            </button>
                            :
                            <button
                                className="btn btn-sm bg-green-800 text-white"
                                onClick={() => setIdPegawai(pegawai.value)}
                            >
                                <FaCheck /> Pilih Pegawai Dan Periode
                            </button>
                    }
                </div>
            </div>
            {
                idPegawai ?
                    <SlipGaji
                        idPegawai={idPegawai}
                        periode={periode}
                    />
                    : <></>
            }
        </div>
    </Wrap>
}
export default SlipGajiPegawaiPage
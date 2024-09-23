import { useEffect, useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { apiDaftarAsetCRUD } from "../../../../service/endPointList.api"
import { FaCheck, FaTimes } from "react-icons/fa"
import HitunganPenyusutanTable from "./component/HitunganPenyusutanTable"

const HitunganPenyusutanPage = () => {
    const [asetList, setAsetList] = useState([])
    const [aset, setAset] = useState()
    const [idAset, setIdAset] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const _getDataAset = () => {
        apiDaftarAsetCRUD
            .custom("", "GET")
            .then(resData => {
                setAsetList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    useEffect(() => {
        _getDataAset()
    }, [])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Hitungan Penyusutan" />
            <div className="bg-white rounded-md shadow-2xl h-max py-5 overflow-scroll no-scrollbar relative">
                <div className="sticky top-0 px-6 h-max bg-white w-full z-10">
                    <div className="flex items-end gap-x-2 mb-5">
                        <FormSelectWithLabel
                            label={"Pilih Aset"}
                            optionsDataList={asetList}
                            optionsLabel={"name"}
                            optionsValue={"uuid"}
                            selectValue={aset}
                            onchange={(e) => {
                                setAset(e)
                            }}
                            selectName={`aset`}
                        />
                        {
                            idAset ?
                                <button
                                    className="btn btn-sm bg-red-800 text-white"
                                    onClick={() => setIdAset(null)}
                                >
                                    <FaTimes /> Reset Aset
                                </button>
                                :
                                <button
                                    className="btn btn-sm bg-green-800 text-white"
                                    onClick={() => setIdAset(aset.value)}
                                >
                                    <FaCheck /> Pilih Aset
                                </button>
                        }
                    </div>
                </div>
            </div>
            {
                idAset ?
                    <>
                        <HitunganPenyusutanTable
                            idAset={idAset}
                            metodePenyusutanName={asetList?.filter(x => x.uuid == idAset).at(0).metode_penyusutan_name}
                        />
                    </>
                    :
                    <></>
            }
        </div>


    </Wrap>
}
export default HitunganPenyusutanPage
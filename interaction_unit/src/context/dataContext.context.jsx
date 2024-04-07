import { useEffect } from "react"
import { createContext } from "react"
import { useState } from "react"
import { apiKodeAkunCRUD } from "../service/endPointList.api"
import { useContext } from "react"
import { getCookie } from "../helper/cookies.helper"

export const DataContext = createContext()

export const useDataContext = () => {
    return useContext(DataContext)
}

export const DataProvider = ({ children }) => {

    const [data, setData] = useState({
        kodeAkun: [],
        tahun: new Date().getFullYear()
    })

    const _getDataKodeAkun = () => {
        if (getCookie("login") && getCookie("login") == "true") {
            apiKodeAkunCRUD
                .custom('', "GET")
                .then(resData => {
                    let dataCopy = data

                    let kodeAkunListCopy = [{
                        code: "",
                        name: " - Belum Terpilih",
                        uuid: ""
                    }, ...resData.data.entry]

                    dataCopy.kodeAkun = kodeAkunListCopy

                    setData(dataCopy)
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        _getDataKodeAkun()
    }, [])

    return (
        <DataContext.Provider value={
            {
                data,
                setData,
                _getDataKodeAkun
            }
        }>
            {children}
        </DataContext.Provider>
    )
}
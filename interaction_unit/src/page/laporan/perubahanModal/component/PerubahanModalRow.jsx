const PerubahanModalRow = ({
    dataList,
    title,
    totalTitle,
    addingContent
}) => {
    return <>
        <div className="flex flex-col w-full bg-white text-sm px-3 shadow-md">
            {
                dataList.data.plus.length > 0 ? <div className="grid grid-cols-12 sticky top-0 bg-white py-2 border-b-2">
                    <div className="p-2 col-span-9 text-black flex items-end">
                        <div className="text-md font-bold">
                            <p className={`text-xl -ml-1 text-white px-2 rounded-md bg-blue-900`}>{title}</p>
                        </div>
                    </div>
                </div> : <></>
            }
            {
                dataList.data.plus.map((item1, i) => {
                    return <>
                        {
                            i > 0 ? <hr /> : <></>
                        }
                        {
                            i <= dataList.data.plus.length ?
                                <div className="grid grid-cols-12 items-start py-1">
                                    <div className="col-span-6 text-gray-900 px-2">
                                        <p className={item1.kode_akun_perkiraan_name == "Modal" ? "font-bold" : ""}>{item1.kode_akun_perkiraan_name} {item1.kode_akun_perkiraan_name == "Modal" ? " ( Awal ) " : ""}</p>
                                    </div>
                                    <div className="col-span-6 text-gray-900 text-right px-2">
                                        <p className={item1.kode_akun_perkiraan_name == "Modal" ? "font-bold" : ""}>{item1.value}</p>
                                    </div>
                                </div> : <></>
                        }
                        {
                            i == dataList.data.plus.length - 1 ?
                                <>
                                    <hr />
                                    <div className="grid grid-cols-12 items-start py-3 font-bold">
                                        <div className="col-span-6 text-gray-900 px-2">
                                            <p>Total</p>
                                        </div>
                                        <div className="col-span-6 text-gray-900 text-right px-2">
                                            <p>{dataList.count.plus}</p>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </>
                })
            }
            <p className="font-bold px-2 py-3">Dikurangi</p>
            {
                dataList.data.minus.map((item1, i) => {
                    return <>
                        {
                            i > 0 ? <hr /> : <></>
                        }
                        {
                            i <= dataList.data.minus.length ?
                                <div className="grid grid-cols-12 items-start py-1">
                                    <div className="col-span-6 text-gray-900 px-2">
                                        <p>{item1.kode_akun_perkiraan_name}</p>
                                    </div>
                                    <div className="col-span-6 text-gray-900 text-right px-2">
                                        <p>{item1.value}</p>
                                    </div>
                                </div> : <></>
                        }
                        {
                            i == dataList.data.minus.length - 1 ?
                                <>
                                    <hr />
                                    <div className="grid grid-cols-12 items-start py-3 font-bold">
                                        <div className="col-span-6 text-gray-900 px-2">
                                            <p>Total</p>
                                        </div>
                                        <div className="col-span-6 text-gray-900 text-right px-2">
                                            <p>{dataList.count.minus}</p>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </>
                })
            }
            <div className="grid grid-cols-12 items-start py-2 font-bold">
                <div className="col-span-6 text-gray-900 px-2">
                    <p>Modal ( Akhir )</p>
                </div>
                <div className="col-span-6 text-gray-900 text-right px-2">
                    <p>{dataList.all_count}</p>
                </div>
            </div>
        </div >
    </>
}
export default PerubahanModalRow;
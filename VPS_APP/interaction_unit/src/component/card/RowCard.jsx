const RowCard = ({
    dataList,
    title,
    totalTitle,
    addingContent,
    forPrint
}) => {

    return <>
        <div className={`flex flex-col w-full bg-white text-sm ${!forPrint ? 'px-3 shadow-md' : ''}`}>
            {
                dataList.data.length > 0 ? <div className="grid grid-cols-12 sticky top-0 bg-white py-2 border-b-2">
                    <div className="p-2 col-span-9 text-black flex items-end">
                        <div className="text-md font-bold">
                            <p className={`text-xl -ml-1 text-white px-2 rounded-md bg-blue-900`}>{title}</p>
                        </div>
                    </div>
                </div> : <></>
            }

            {
                dataList.data.map((item1, i) => {
                    return <>
                        {
                            i > 0 ? <hr /> : <></>
                        }
                        {
                            i <= dataList.data.length ?
                                <div className="grid grid-cols-12 items-start py-1">
                                    <div className="col-span-6 text-gray-900 px-2">
                                        <p>{item1.kode_akun_perkiraan_code} - {item1.kode_akun_perkiraan_name}</p>
                                    </div>
                                    <div className="col-span-6 text-gray-900 text-right px-2">
                                        <p>{item1.value}</p>
                                    </div>
                                </div> : <></>
                        }
                        {
                            i == dataList.data.length - 1 ?
                                <>
                                    <hr />
                                    <div className="grid grid-cols-12 items-start py-3 font-bold">
                                        <div className="col-span-6 text-gray-900 px-2">
                                            <p>{totalTitle}</p>
                                        </div>
                                        <div className="col-span-6 text-gray-900 text-right px-2">
                                            <p>{dataList.count}</p>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </>
                })
            }

        </div >

        {
            addingContent != null && addingContent.value != "0" && addingContent.value != "( 0 )" ? <>
                <div className="flex flex-col w-full bg-gray-800 text-white font-bold text-sm px-3 shadow-md rounded-md rounded-t-none">
                    <div className="grid grid-cols-12 items-start py-2">
                        <div className="col-span-6 px-2">
                            <p>{addingContent.title}</p>
                        </div>
                        <div className="col-span-6 text-right px-2">
                            <p>{addingContent.value}</p>
                        </div>
                    </div>
                </div>
            </> : <></>
        }
    </>
};

export default RowCard;

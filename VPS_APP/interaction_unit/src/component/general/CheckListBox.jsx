const CheckListBox = ({
    setCheckListBox = () => { },
    checkListBox = [],
    checkListBoxList = [],
    label = ""
}) => {
    return <div className="bg-white rounded px-4 py-2 mb-3">
        <h1 className="font-bold">{label}</h1>
        <div className={`flex ${label ? "mt-3" : ""}`}>
            {
                checkListBoxList.map((item, i) => {
                    return <>
                        <button
                            className={`border text-xs font-bold px-3 py-1 rounded-md ${i == 0 ? "rounded-r-none" : "border-l-0 rounded-l-none"} ${checkListBox.filter(x => x == item.value).length > 0 ? "border-blue-900 bg-blue-900 text-white" : ""}`}
                            onClick={() => {
                                if (checkListBox.filter(x => x == item.value).length > 0) {
                                    if (checkListBox.filter(i => i !== item.value).length != 0) {
                                        setCheckListBox(x => x = checkListBox.filter(i => i !== item.value))
                                    }
                                } else {
                                    let checkListBoxCopy = [...checkListBox]
                                    checkListBoxCopy.push(item.value)
                                    setCheckListBox(checkListBoxCopy)
                                }
                            }}
                        >
                            {item.label}
                        </button>
                    </>
                })
            }
        </div>
    </div>
}
export default CheckListBox
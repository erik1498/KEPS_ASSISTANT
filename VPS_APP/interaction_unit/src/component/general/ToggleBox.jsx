const ToggleBox = ({
    setToggleBox = () => { },
    toggleBox = 0,
    toggleBoxList = [],
    label = ""
}) => {
    return <div className="bg-white rounded py-2 mb-3">
        <h1 className="font-bold">{label}</h1>
        <div className={`flex ${label ? "mt-3" : ""}`}>
            {
                toggleBoxList.map((item, i) => {
                    return <>
                        <button
                            className={`border text-xs font-bold px-3 py-1 rounded-md ${i == 0 ? "rounded-r-none" : "border-l-0 rounded-l-none"} ${i < toggleBoxList.length - 1 ? "rounded-r-none" : ""} ${item.value == toggleBox ? "border-blue-900 bg-blue-900 text-white" : ""}`}
                            onClick={() => {
                                setToggleBox(x => x = item.value)
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
export default ToggleBox
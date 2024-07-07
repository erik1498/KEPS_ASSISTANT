const FormInputImage = ({
    label,
    handleChange = () => { },
    file,
    fileEditClass,
    heightClass = "h-[300px]",
    widthClass = "w-[300px]"
}) => {
    return <div className={`${widthClass} ${heightClass}`}>
        <label className={`form-control ${widthClass} ${heightClass} bg-white relative`}>
            {
                label ?
                    <div className="label">
                        <span className="label-text text-gray-800 font-bold">{label}</span>
                    </div> : <></>
            }
            <div className={`relative ${heightClass} ${widthClass}`}>
                <input type="file" onChange={handleChange}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer"
                    }} className={fileEditClass} />
                <img src={file} style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                    zIndex: 1,
                    cursor: "pointer"
                }} className="rounded-md" />
            </div>
        </label>
    </div>
}
export default FormInputImage
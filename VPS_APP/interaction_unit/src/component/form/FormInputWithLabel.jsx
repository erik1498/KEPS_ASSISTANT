const FormInputWithLabel = ({
    label,
    type,
    onchange = () => { },
    others,
    addClassLabel = '',
    addClassInput = '',
    addClassParent = '',
    disabled
}) => {
    return <div className={`${addClassParent} w-full`}>
        <label className="form-control w-full bg-white relative">
            <div className={`${addClassLabel} label`}>
                <span className="label-text w-full text-gray-800 font-bold">{label}</span>
            </div>
            <div className="w-full relative">
                <input
                    type={type}
                    step={"any"}
                    onChange={onchange}
                    className={`${addClassInput} bg-white input-sm border-b-2 border-gray-800 text-gray-800 outline-none py-2 w-full ${disabled ? "pointer-events-none" : ""}`}
                    {...others}
                    autoComplete="off"
                />
            </div>
        </label>
    </div>
}

export default FormInputWithLabel
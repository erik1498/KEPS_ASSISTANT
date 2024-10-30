import FormInput from "./FormInput"
import FormSelect from "./FormSelect"

const FormSelectWithLabel = ({
    label,
    optionsDataList,
    optionsLabel,
    optionsValue,
    selectValue,
    optionsLabelIsArray,
    optionsDelimiter,
    disabled,
    onchange,
    selectName,
    addClass,
    addSelectStyle,
    addLabelStyle,
}) => {
    return <>
        <label className={`form-control w-full bg-white relative ${disabled ? "pointer-events-none" : ""}`}>
            <div className="label">
                <span className={`${addLabelStyle} label-text text-gray-800 font-bold`}>{label}</span>
            </div>
            <div className="w-full relative">
                {
                    disabled ? <>
                        <FormInput
                            value={selectValue.label}
                        />
                        {/* <p>{label}</p> */}
                    </> : <>
                        <FormSelect
                            addClass={addClass}
                            optionsDataList={optionsDataList}
                            optionsLabel={optionsLabel}
                            optionsValue={optionsValue}
                            selectValue={selectValue}
                            optionsLabelIsArray={optionsLabelIsArray}
                            optionsDelimiter={optionsDelimiter}
                            onchange={onchange}
                            selectName={selectName}
                            customStyle={
                                {
                                    ...addSelectStyle,
                                    border: 'none',
                                    boxShadow: 'none',
                                    fontSize: '14px',
                                    minHeight: '20px',
                                    height: '30px'
                                }
                            }
                        />
                    </>
                }
            </div>
        </label>
    </>
}
export default FormSelectWithLabel
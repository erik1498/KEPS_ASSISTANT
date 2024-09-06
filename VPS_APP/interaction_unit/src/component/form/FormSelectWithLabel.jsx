import FormSelect from "./FormSelect"

const FormSelectWithLabel = ({
    label,
    optionsDataList,
    optionsLabel,
    optionsValue,
    selectValue,
    disabled,
    onchange,
    selectName
}) => {
    return <>
        <label className={`form-control w-full bg-white relative ${disabled ? "pointer-events-none" : ""}`}>
            <div className="label">
                <span className="label-text text-gray-800 font-bold">{label}</span>
            </div>
            <div className="w-full relative">
                <FormSelect
                    optionsDataList={optionsDataList}
                    optionsLabel={optionsLabel}
                    optionsValue={optionsValue}
                    selectValue={selectValue}
                    onchange={onchange}
                    selectName={selectName}
                    customStyle={
                        {
                            border: 'none',
                            boxShadow: 'none',
                            fontSize: '14px',
                            minHeight: '20px',
                            height: '30px'
                        }
                    }
                />
            </div>
        </label>
    </>
}
export default FormSelectWithLabel
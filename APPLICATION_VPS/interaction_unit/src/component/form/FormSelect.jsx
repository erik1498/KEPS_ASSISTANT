import Select from "react-select"
import { convertDataToSelectOptions } from "../../helper/select.helper"

const FormSelect = ({
    optionsDataList,
    optionsLabel,
    optionsValue,
    optionsLabelIsArray,
    optionsDelimiter,
    selectValue,
    onchange = () => { },
    selectName,
    addClass,
    customStyle = {
        border: 'none',
        boxShadow: 'none',
        fontSize: '14px',
        minHeight: '18px',
        height: '30px'
    }
}) => {
    return <>
        <Select
            options={
                convertDataToSelectOptions(optionsDataList, optionsLabel, optionsValue, optionsLabelIsArray, optionsDelimiter)
            }
            value={
                selectValue
            }
            onChange={onchange}
            name={selectName}
            classNamePrefix={
                "selectInput"
            }
            styles={{
                control: (styles) => (
                    {
                        ...styles,
                        ...customStyle
                    }
                )
            }}
            className={`${addClass} border-b-2 border-gray-800`} />
    </>
}

export default FormSelect
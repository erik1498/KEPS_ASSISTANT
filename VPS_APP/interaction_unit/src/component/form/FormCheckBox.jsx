const FormCheckBox = ({
    item,
    checkedKey,
    updateCheckBox = () => { }
}) => {
    return <>
        <input
            type="checkbox"
            checked={item[checkedKey]}
            className="checkbox checkbox-sm"
            onChange={updateCheckBox}
        />
    </>
}
export default FormCheckBox
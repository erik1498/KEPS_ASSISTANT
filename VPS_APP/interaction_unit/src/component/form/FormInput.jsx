const FormInput = ({
  name,
  border = true,
  type,
  onchange = () => { },
  value,
  other,
  addClass
}) => {
  return (
    <div className="w-full relative">
      <input
        maxLength={200}
        name={name}
        type={type}
        className={`${addClass} ${border ? `border-b-2 border-gray-800` : `border-none `} bg-transparent px-3 py-1 input-sm w-full outline-none`}
        value={value}
        onChange={onchange}
        {...other}
        autoComplete="off"
      />
    </div>
  );
};

export default FormInput;

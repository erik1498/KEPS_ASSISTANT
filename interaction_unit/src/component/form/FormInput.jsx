const FormInput = ({
  name,
  border = true,
  type,
  onchange = () => { },
  value,
  other
}) => {
  return (
    <div className="w-full relative">
      <input
        name={name}
        type={type}
        className={` ${border ? `border-b-2 border-gray-800` : `border-none `} bg-transparent px-3 py-1 text-[16px] w-full outline-none`}
        value={value}
        onChange={onchange}
        {...other}
        autoComplete="off"
      />
    </div>
  );
};

export default FormInput;

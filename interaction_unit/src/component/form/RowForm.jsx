const RowForm = ({
  extraClass = '',
  extraLabelClass = '',
  label = '',

  isRequired = false,

  children,
}) => {
  return (
    <div className={'flex ' + extraClass}>
      <div className="w-4/12">
        <label className={'rfh-label ' + extraLabelClass}>
          {label}
          {isRequired ? (
            <span className="text-base text-red-500">
              {isRequired ? '*' : ''}
            </span>
          ) : null}
        </label>
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
};

export default RowForm;

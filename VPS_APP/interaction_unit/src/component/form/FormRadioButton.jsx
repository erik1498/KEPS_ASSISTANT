import { useId } from 'react';

const FormRadioButton = (props) => {
  const {
    id = '',
    value = '',
    defaultValue = '',
    extraClass = '',
    label = '',
    name = '',
    extraRadioClass = '',

    required = false,
    disabled = false,
    readOnly = false,

    actions = {
      onChange: () => {},
    },
  } = props;

  const idInput = id || 'form-radio-' + name + useId();
  const isChecked = defaultValue === value ? true : false;

  return (
    <div className={'form-group mb-6 ' + extraClass}>
      <div className="flex items-center gap-x-3">
        <input
          id={idInput}
          type="radio"
          value={defaultValue}
          name={name}
          onChange={actions.onChange}
          checked={isChecked}
          className={'radio ' + extraRadioClass}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />

        <label htmlFor={idInput} className="form-label">
          {label}
        </label>
      </div>
    </div>
  );
};

export default FormRadioButton;

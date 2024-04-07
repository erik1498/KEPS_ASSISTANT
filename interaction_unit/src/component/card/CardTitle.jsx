import { memo } from 'react';

const CardTitle = memo(({ title = '', className = '' }) => {
  return (
    <div className={'text-lg font-medium text-slate-500 my-2 ' + className}>
      {title}
    </div>
  );
});

export default CardTitle;

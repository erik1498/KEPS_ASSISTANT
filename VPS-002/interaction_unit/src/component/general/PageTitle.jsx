import { memo } from 'react';

const PageTitle = memo(({ title = '' }) => {
  return (
      <h1 className="text-xl my-5 uppercase text-white font-bold">{title}</h1>
  );
});

export default PageTitle;

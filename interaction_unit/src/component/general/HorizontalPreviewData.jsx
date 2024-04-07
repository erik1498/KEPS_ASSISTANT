import { memo } from 'react';

const HorizontalPreviewData = memo(
  ({
    title = '',
    content = '',
    isLayoutContentDefault = true,
    subTitle = '',
  }) => {
    return (
      <div className="flex">
        <div className="w-4/12 mb-4">
          <div className="text-base text-slate-400">{title}</div>
          {subTitle ? (
            <div className="text-xs text-slate-400">{subTitle}</div>
          ) : null}
        </div>

        <div className="w-8/12 mb-4">
          {isLayoutContentDefault ? (
            <div className="text-lg font-normal text-neutral-500">
              {content}
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    );
  },
);

export default HorizontalPreviewData;

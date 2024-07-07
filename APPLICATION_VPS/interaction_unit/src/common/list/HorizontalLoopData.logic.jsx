import { memo } from 'react';
import * as _ from 'lodash';
import HorizontalPreviewData from '../../component/general/HorizontalPreviewData';

const HorizontalLoopDataLogic = memo(
  ({ list = [], config = {}, className = '' }) => {
    return (
      <div className={className}>
        {list.map((vm = {}, index) => {
          if (!_.isEmpty(vm)) {
            return <HorizontalPreviewData key={index} {...vm} />;
          }
        })}
      </div>
    );
  },
);

export default HorizontalLoopDataLogic;

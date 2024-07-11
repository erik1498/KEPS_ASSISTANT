import * as _ from 'lodash';

const TrTextLoad = ({
  isLoading = true,
  colSpan = 1,
  text = 'Loading',
  extraClass = '',
}) => (
  <tr className="">
    <td colSpan={colSpan} className="py-6">
      <h4
        className={
          'flex items-center justify-center gap-x-3 text-xl font-normal text-slate-300 mb-0 ' +
          extraClass
        }
      >
        {text}{' '}
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : null}
      </h4>
    </td>
  </tr>
);

const TableThemeLogic = ({
  ths = [],
  tds = [],
  isLoading = false,
  className = '',
  isNoWrap = false,
  id = '',
  children,
}) => {
  const thsLength = ths.length;

  return (
    <>
      <table id={id} className={'table ' + className}>
        <thead>
          <tr>
            {ths.map((th, idx) => {
              let content = th;
              let className = '';
              let attribute = {};
              if (_.isObject(th)) {
                content = th.content;
                className = th.className || '';
                attribute = _.isObject(th.attribute) ? th.attribute : {};
              }

              return (
                <th className={className} key={idx} {...attribute}>
                  {content}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <TrTextLoad colSpan={thsLength} />
          ) : tds.length ? (
            !_.isEmpty(children) ? (
              children
            ) : (
              tds.map((dataTd = [], indexTd) => {
                return (
                  <tr
                    key={indexTd}
                    className={`${isNoWrap ? 'whitespace-nowrap ' : ' '} `}
                  >
                    {dataTd.map((list, index) => {
                      const content = list?.content || list;
                      const className = list?.className || '';

                      const attribute =
                        !_.isEmpty(list) && _.isObject(list.attribute)
                          ? list.attribute
                          : {};

                      return (
                        <td className={className} key={index} {...attribute}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )
          ) : (
            <TrTextLoad
              isLoading={false}
              text="Not Available"
              colSpan={thsLength}
            />
          )}
        </tbody>
      </table>
    </>
  );
};

export default TableThemeLogic;

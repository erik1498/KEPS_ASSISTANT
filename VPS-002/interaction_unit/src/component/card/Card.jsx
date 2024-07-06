const Card = ({
  extraClass = '',
  extraClassBody = '',
  title = '',
  children,
}) => {
  return (
    <div className={'card border-0 rounded-lg overflow-hidden ' + extraClass}>
      {title ? (
        <div className="card-header border-0 bg-white px-4 py-2">
          <div className="card-title my-2">
            <div className="text-lg font-medium mb-0">{title}</div>
          </div>
        </div>
      ) : null}
      <div className={'card-body bg-white p-4 ' + extraClassBody}>
        {children}
      </div>
    </div>
  );
};

export default Card;

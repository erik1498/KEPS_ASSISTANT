const LoadingNotAvailable = ({ isLoading = false, config = {} }) => {
  const { isCard = true, extraClass = '' } = config;
  return (
    <>
      <div
        className={
          'w-full py-6 ' + (isCard ? 'bg-white rounded-lg ' : '') + extraClass
        }
      >
        <div className="flex items-center justify-center gap-3 text-xl font-normal text-center text-slate-300 mb-0">
          {isLoading ? (
            <>
              Please wait{' '}
              <span className="loading loading-spinner loading-sm"></span>
            </>
          ) : (
            'Not Available'
          )}
        </div>
      </div>
    </>
  );
};

export default LoadingNotAvailable;

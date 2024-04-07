import ReactPaginate from "react-paginate"

const Pagination = ({
    paginateUpdatePage,
    paginate,
    setSize,
    contentBefore
}) => {
    return <div className="mt-3 flex gap-x-2">
        {contentBefore}
        <h1 className="bg-white px-6 py-3 rounded-md shadow-xl font-bold">
            Total : {paginate.count}
        </h1>
        <select value={paginate.size} onChange={(e) => setSize(e.target.value)} className="select select-bordered w-full max-w-xs shadow-xl font-bold">
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
        </select>
        <ReactPaginate
            previousLabel={"< Previous"}
            nextLabel={"Next >"}
            pageCount={paginate?.lastPage}
            onPageChange={paginateUpdatePage}
            forcePage={paginate?.page - 1}
            containerClassName={"join shadow-xl"}
            pageLinkClassName={"join-item btn"}
            previousLinkClassName={"join-item btn"}
            nextLinkClassName={"join-item btn"}
            activeLinkClassName={"join-item btn bg-blue-900 text-white"}
            disabledLinkClassName={"join-item btn"}
            breakClassName="join-item btn bg-gray-300"
        />
    </div>
}
export default Pagination
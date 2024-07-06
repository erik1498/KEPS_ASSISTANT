export const generatePaginationResponse = (entry, count, page, size) => {
    return {
        entry,
        pagination:{
            count,
            page: parseInt(page),
            size: parseInt(size),
            lastPage: Math.ceil(count / size) ? Math.ceil(count / size) : 0
        }
    }
}
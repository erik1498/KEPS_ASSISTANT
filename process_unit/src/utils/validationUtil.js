export const generateValidationMessage = (error) => {
    let errorMessageObject = []
    error.details.map((err) => {
        errorMessageObject.push({
            prop: err.path[0],
            message: err.message
        })
    })
    return errorMessageObject
}
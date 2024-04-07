export const formValidation = () => {
    return new Promise((res, rej) => {
        let falseField = [];

        const inputList = document.querySelectorAll("input")

        inputList.forEach(element => {
            if (!element.classList.contains("no-required")) {
                const parentChildList = element.parentNode.querySelectorAll(".form-message")

                if (element.value.toString() == "" && !element.classList.contains("selectInput__input")) {
                    if (parentChildList.length == 0) {
                        const divMessage = document.createElement("div")
                        divMessage.className = "form-message"
                        divMessage.innerHTML = "* Harus Diisi"

                        element.parentNode.appendChild(divMessage)
                    }

                    falseField.push({
                        name: element.name
                    })

                } else {
                    parentChildList.forEach(item => {
                        item.remove()
                    })
                }
            }

        })

        res(falseField.length == 0)
    })
}

export const formShowMessage = (errorData) => {
    let element = document.getElementsByName(errorData.field)
    if (element.length > 0) {
        const divMessage = document.createElement("div")
        divMessage.className = "form-message"
        divMessage.innerHTML = `* ${errorData.message}`

        element[0].parentNode.appendChild(divMessage)
    }
}
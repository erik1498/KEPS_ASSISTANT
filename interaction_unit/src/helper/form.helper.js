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

export const showError = (error) => {
    let errorMessage = JSON.parse(error.response.data.errorData)

    let alertElement = document.getElementById("alertElement")
    if (alertElement) {
        alertElement.remove()
    }

    const divAlert = document.createElement("div")
    divAlert.className = "absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80"
    divAlert.id = "alertElement"
    divAlert.style.zIndex = 999

    const divAlertChild = document.createElement("div")
    divAlertChild.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white font-bold px-16 py-20 rounded-box flex flex-col gap-y-4"


    const titleH1 = document.createElement("h1")
    titleH1.className = "text-8xl font-bold"
    titleH1.innerHTML = `Oppss..!!!`

    const messageError = document.createElement("p")
    messageError.className = "text-2xl ml-2"
    messageError.innerHTML = errorMessage.message

    const buttonClose = document.createElement("button")
    buttonClose.className = "btn bg-blue-900 hover:bg-blue-900 text-white mt-5"
    buttonClose.innerHTML = "TUTUP"
    buttonClose.addEventListener("click", (e) => {
        e.target.parentNode.parentNode.remove()
    })

    const root = document.getElementById("root")

    divAlertChild.appendChild(titleH1)
    divAlertChild.appendChild(messageError)
    divAlertChild.appendChild(buttonClose)
    divAlert.appendChild(divAlertChild)

    root.appendChild(divAlert)
}


export const showAlert = (title, message) => {
    let alertElement = document.getElementById("alertElement")
    if (alertElement) {
        alertElement.remove()
    }

    const divAlert = document.createElement("div")
    divAlert.className = "absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80"
    divAlert.id = "alertElement"
    divAlert.style.zIndex = 999

    const divAlertChild = document.createElement("div")
    divAlertChild.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white font-bold px-16 py-20 rounded-box flex flex-col gap-y-4"


    const titleH1 = document.createElement("h1")
    titleH1.className = "text-4xl font-bold"
    titleH1.innerHTML = title

    const messageError = document.createElement("p")
    messageError.className = "text-2xl ml-2"
    messageError.innerHTML = message

    const buttonClose = document.createElement("button")
    buttonClose.className = "btn bg-blue-900 hover:bg-blue-900 text-white mt-5"
    buttonClose.innerHTML = "TUTUP"
    buttonClose.addEventListener("click", (e) => {
        e.target.parentNode.parentNode.remove()
    })

    const root = document.getElementById("root")

    divAlertChild.appendChild(titleH1)
    divAlertChild.appendChild(messageError)
    divAlertChild.appendChild(buttonClose)
    divAlert.appendChild(divAlertChild)

    root.appendChild(divAlert)
}


export const showDialog = (title, message) => {
    return new Promise((res, rej) => {
        let alertElement = document.getElementById("alertElement")
        if (alertElement) {
            alertElement.remove()
        }

        const divAlert = document.createElement("div")
        divAlert.className = "absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80"
        divAlert.id = "alertElement"
        divAlert.style.zIndex = 999

        const divAlertChild = document.createElement("div")
        divAlertChild.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white font-bold px-16 py-10 rounded-box flex flex-col gap-y-4"


        const titleH1 = document.createElement("h1")
        titleH1.className = "text-4xl font-bold"
        titleH1.innerHTML = title

        const messageError = document.createElement("p")
        messageError.className = "text-2xl"
        messageError.innerHTML = message

        const buttonConfirm = document.createElement("button")
        buttonConfirm.className = "btn bg-blue-900 hover:bg-blue-900 text-white mt-5"
        buttonConfirm.innerHTML = "Ya"
        buttonConfirm.addEventListener("click", (e) => {
            e.target.parentNode.parentNode.remove()
            res(true)
        })

        const buttonClose = document.createElement("button")
        buttonClose.className = "btn"
        buttonClose.innerHTML = "Tidak"
        buttonClose.addEventListener("click", (e) => {
            e.target.parentNode.parentNode.remove()
            res(false)
        })



        const root = document.getElementById("root")

        divAlertChild.appendChild(titleH1)
        divAlertChild.appendChild(messageError)
        divAlertChild.appendChild(buttonConfirm)
        divAlertChild.appendChild(buttonClose)
        divAlert.appendChild(divAlertChild)

        root.appendChild(divAlert)
    })
}
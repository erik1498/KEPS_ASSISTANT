export const getBulanList = () => {
    return ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
}

export const getTanggal = (withBulanTahun = false) => {
    let tgl = []
    for (let index = 0; index < 31; index++) {
        tgl.push(`${index + 1}${withBulanTahun ? ` ${getBulanByIndex(new Date().getMonth())} ${new Date().getFullYear()}` : ``}`)
    }
    return tgl
}

export const getBulanByIndex = (index) => {
    return getBulanList()[index]
}

export const statusBulanNow = (monthText) => {
    return getBulanList()[new Date().getMonth()] == monthText
}

export const getHariTanggal = () => {
    return new Date().toISOString().slice(0, 10)
}

export const getHariTanggalFull = () => {
    const dateNow = new Date()

    const year = dateNow.getFullYear()
    const month = dateNow.getMonth() + 1 < 10 ? `0${dateNow.getMonth() + 1}` : dateNow.getMonth() + 1
    const date = dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate()

    const hour = dateNow.getHours() < 10 ? `0${dateNow.getHours()}` : dateNow.getHours()
    const minute = dateNow.getMinutes() < 10 ? `0${dateNow.getMinutes()}` : dateNow.getMinutes()
    const second = dateNow.getSeconds() < 10 ? `0${dateNow.getSeconds()}` : dateNow.getSeconds()

    return `${year}-${month}-${date}T${hour}:${minute}:${second}.000`
}

export const formatDate = (dateString, withHours = true) => {
    if (!dateString) {
        return ""
    }
    
    let date = new Date(dateString);

    // Mendapatkan komponen tanggal
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() dimulai dari 0
    let year = date.getFullYear();

    let formattedDate = day + '/' + month + '/' + year;

    if (withHours) {

        // Mendapatkan komponen waktu
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let seconds = date.getSeconds().toString().padStart(2, '0');

        // Mengatur format 12 jam
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Ubah 0 jam menjadi 12
        let formattedTime = hours.toString().padStart(2, '0') + ':' + minutes + ':' + seconds + ' ' + ampm;
        return formattedDate + ' ' + formattedTime;

    }

    return formattedDate;
}

export const convertTo12HoursFormat = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        time = time.slice(1);
        time[5] = +time[0] < 12 ? ' AM' : ' PM';
        time[0] = +time[0] % 12 || 12;
    }

    return time.join('');
}

export const myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
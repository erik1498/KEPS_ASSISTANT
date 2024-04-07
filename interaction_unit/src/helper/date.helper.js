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
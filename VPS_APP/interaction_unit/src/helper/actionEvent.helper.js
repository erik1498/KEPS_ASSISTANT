import { parseRupiahToFloat, parseToRupiahText } from "./number.helper";

export const eventChange = (event = () => { }) => {
  const target = event.target;
  let isChecked = null;
  const value = target?.type === 'number' ? Number(target.value) : target.value;
  const name = target.name;

  if (target?.type === 'checkbox') {
    isChecked = target.checked ? 1 : 0;
  }

  return { name, value, isChecked };
};

export const inputOnlyRupiah = (e, max) => {

  let rupiah = parseToRupiahText(e.target.value.replace(/[^\d.,]+|(?<=\..*)\./g, ''))
  e.target.value = rupiah

  if (max != null) {
    let value = e.target.value
    if (!value.endsWith('.')) {
      value = parseRupiahToFloat(value)
      // Jika hasilnya bukan angka, tetapkan 0
      if (isNaN(value)) {
        value = 0;
      }
      // Pastikan nilai tidak melebihi max
      if (value > max) {
        value = max;
      }
      e.target.value = value
    }
  }

  if (e.target.value == "") {
    return e.target.value = 0;
  }
  rupiah = parseToRupiahText(e.target.value.replace(/[^\d.,]+|(?<=\..*)\./g, ''))
  e.target.value = rupiah
  let split = rupiah.split(".")
  if (split.length == 2) {
    let comma = split[1].length > 2 ? split[1].slice(0, 2) : split[1]
    let hasil = split[0] + "." + comma
    if (hasil.at(0) == "0") {
      hasil = hasil.slice(1, hasil.length)
    }
    e.target.value = hasil
  }
}

export const inputOnlyNumber = (e, max) => {
  if (max != null) {
    let value = e.target.value
    if (!value.endsWith('.')) {
      value = parseRupiahToFloat(value)
      // Jika hasilnya bukan angka, tetapkan 0
      if (isNaN(value)) {
        value = 0;
      }
      // Pastikan nilai tidak melebihi max
      if (value > max) {
        value = max;
      }
      e.target.value = value
    }
  }

  if (e.target.value == "") {
    return e.target.value = 0;
  }
  let number = e.target.value.replace(/[^\d.]+|(?<=\..*)\./g, '')

  // Kemudian, hapus angka 0 di depan (leading zero), kecuali angka tersebut adalah 0 atau 0.xx
  number = number.replace(/^0+(?=\d)/, '');

  e.target.value = number
}
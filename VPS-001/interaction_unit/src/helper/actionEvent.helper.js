import { parseToRupiahText } from "./number.helper";

export const eventChange = (event = () => {}) => {
  const target = event.target;
  let isChecked = null;
  const value = target?.type === 'number' ? Number(target.value) : target.value;
  const name = target.name;

  if (target?.type === 'checkbox') {
    isChecked = target.checked ? 1 : 0;
  }

  return { name, value, isChecked };
};

export const inputOnlyRupiah = (e) => {
  if (e.target.value == "") {
      return e.target.value = 0;
  }
  let rupiah = parseToRupiahText(e.target.value.replace(/[^\d,.]+/g, ''))
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

export const inputOnlyNumber = (e) => {
  if (e.target.value == "") {
      return e.target.value = 0;
  }
  let number = e.target.value.replace(/[^0-9]/g, '')
  e.target.value = number
}
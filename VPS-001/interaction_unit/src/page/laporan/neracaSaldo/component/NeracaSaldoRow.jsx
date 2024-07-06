import { parseToRupiahText } from "../../../../helper/number.helper";

const NeracaSaldoRow = ({
    item
}) => {
    return <>
        <hr />
        <div className="grid grid-cols-12 items-start py-1">
            <div className="col-span-4 text-gray-900 px-2">
                <p>{item.kode_akun_perkiraan_code} - {item.kode_akun_perkiraan_name}</p>
            </div>
            <div className="col-span-4 text-green-900 px-2 font-bold">
                {
                    item.debet > 0 ? <p>{parseToRupiahText(item.debet)}</p> : <></>
                }
            </div>
            <div className="col-span-4 text-red-900 px-2 font-bold">
                {
                    item.kredit > 0 ? <p>{parseToRupiahText(item.kredit)}</p> : <></>
                }
            </div>
        </div>
    </>
};

export default NeracaSaldoRow;

const PerintahStokOpnameUraian = ({ item }) => {
    return <>
        <p>{item.sumber != "PERINTAH STOK OPNAME" ? item.sumber : item.uraian}</p>
    </>
}
export default PerintahStokOpnameUraian
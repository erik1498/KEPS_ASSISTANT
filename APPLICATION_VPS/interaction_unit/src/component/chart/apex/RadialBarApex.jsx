import Chart from "react-apexcharts";
import { getTanggal } from "../../../helper/date.helper";
import { getRandom } from "../../../helper/number.helper";

const RadialBarApex = () => {
    const options = {
        labels: ['Debet'],
    }
    const series = [80]
    return <Chart options={options} series={series} type="radialBar" height={"300"} />
}
export default RadialBarApex;
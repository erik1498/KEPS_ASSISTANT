import Chart from "react-apexcharts"
import { getRandom } from "../../../helper/number.helper"

const CandlestickApex = () => {
    const series = [{
        data: [{
            x: new Date(),
            y: getRandom(6)
        },
        {
            x: new Date(),
            y: getRandom(6)
        },
        {
            x: new Date(),
            y: getRandom(6)
        }
        ]
    }]
    const plotOptions = {
        candlestick: {
            wick: {
                useFillColor: true,
            }
        },
        xaxis:{
            show: false,
        },
        yaxis: {
            show: false,
            labels: {
                formatter: (value) => { return `Rp. ${parseToRupiahText(value)}` },
            }
        },
    }
    return <Chart series={series} options={plotOptions} type="candlestick" height={300} />
}
export default CandlestickApex
import Chart from "react-apexcharts"
import { KodeAkunType } from "../../../config/objectList.config"
import { getRandom, parseToRupiahText } from "../../../helper/number.helper"

const RadarApex = ({
    series,
    categories,
    height
}) => {
    const options = {
        chart: {
            type: "bar",
            id: "basic-bar",
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            fontWeight: 600,
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: categories?.map(i => "#000"),
                    fontWeight: 500,
                },
            }
        },
        yaxis: {
            show: false,
            labels: {
                formatter: (value) => { return `${parseToRupiahText(value)}` },
            }
        },
        colors: ['#15803d', '#dc2626'],
        fill: {
            opacity: .1
        }
    }
    return <Chart options={options} series={series} type="radar" height={height}
        style={{ width: "100%", height: "100%", display:"flex", alignItems:"center", justifyContent:"center", marginLeft:"5%" }
        }
    />
}
export default RadarApex
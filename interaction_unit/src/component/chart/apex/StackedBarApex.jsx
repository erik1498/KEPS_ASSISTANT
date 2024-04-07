import Chart from "react-apexcharts";
import { getBulanList, getTanggal } from "../../../helper/date.helper";
import { getRandom, parseToRupiahText } from "../../../helper/number.helper";
import { KodeAkunType } from "../../../config/objectList.config";

const StackedBarApex = ({
    series,
    height,
    seriesValueLabel,
    colors = ['#15803d', '#dc2626']
}) => {
    const options = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false,
        },
        colors: colors,
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            fontWeight: 800,
            formatter: (seriesName, opt) => {
                if (seriesValueLabel && seriesValueLabel[opt.seriesIndex]) {
                    return `Rp. ${seriesValueLabel[opt.seriesIndex]}`
                }else{
                    return seriesName
                }
            }
        },
        xaxis: {
            labels: {
                // show: false
                style:{
                    fontWeight: 800
                }
            },
        },
        yaxis: {
            show: false,
            labels: {
                formatter: (value) => { return `Rp. ${parseToRupiahText(value)}` },
            }
        },
    }

    return <Chart options={options} series={series} height={height} type="bar" />
}
export default StackedBarApex;
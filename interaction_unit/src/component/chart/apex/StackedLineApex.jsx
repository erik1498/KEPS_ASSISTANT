import Chart from "react-apexcharts";
import { getTanggal } from "../../../helper/date.helper";
import { getRandom, parseToRupiahText } from "../../../helper/number.helper";

const StackedLineApex = ({
    series,
    height,
    seriesValueLabel,
    valueUseRp = true
}) => {
    const options = {
        chart: {
            type: "bar",
            id: "basic-bar",
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    selection: false,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                },
            },
            zoom: {
                enabled: true
            }
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            // enabled: true,
        },
        colors: ['#15803d', '#dc2626'],
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            fontWeight: 600,
            formatter: (seriesName, opt) => {
                return `Rp. ${parseToRupiahText(seriesValueLabel[opt.seriesIndex])}`
            }
        },
        xaxis: {
            categories: getTanggal(true),
            // axisBorder: {
            //     show: false
            // },
            // axisTicks: {
            //     show: false
            // },
            labels: {
                show: false
            },
        },
        yaxis: {
            // axisBorder: {
            //     show: false
            // },
            // axisTicks: {
            //     show: false
            // },
            show: false,
            labels: {
                formatter: (value) => { return `${valueUseRp ? `Rp. ` : ``}${parseToRupiahText(value)}` },
            }
        },
    }
    return <Chart options={options} series={series} height={height} type="line" />
}
export default StackedLineApex;
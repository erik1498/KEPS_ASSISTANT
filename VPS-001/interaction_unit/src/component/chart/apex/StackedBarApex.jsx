import Chart from "react-apexcharts";
import { getRandom, parseToRupiahText } from "../../../helper/number.helper";

const StackedBarApex = ({
    series,
    categories,
    height,
    seriesValueLabel,
    valueUseRp = true,
    colors = ['#15803d', '#dc2626'],
    stacked = false,
    seriesRupiah = true
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
            stacked: stacked,
            zoom: {
                enabled: true
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
            fontWeight: 600,
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    fontWeight: 600
                }
            }
        },
        yaxis: {
            show: false,
            labels: {
                formatter: (value) => { return `${valueUseRp ? `Rp. ` : ``}${parseToRupiahText(value)}` },
            }
        },
    }
    return <>
        <div className="flex w-full justify-center gap-x-2 my-3">
            {
                seriesValueLabel.map((i, idx) => {
                    return <>
                        <div className={`p-2 rounded-md`} style={{
                            backgroundColor: colors[idx]
                        }}></div>
                        <p className="text-xs font-bold">{seriesRupiah ? `Rp. ` : ``}{i}</p>
                    </>
                })
            }
        </div>
        <Chart options={options} series={series} height={height} type="bar" />
    </>
}
export default StackedBarApex;
import Chart from "react-apexcharts"

const HorizontalBarApex = ({
    categories,
    series,
    height
}) => {
    const options = {
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        chart: {
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
        },
        colors: ['#15803d', '#dc2626'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: categories,
            labels: {
                styles: {
                    fontWeight: 800
                }
            }
        },
        yaxis: {
            labels: {
                styles: {
                    fontWeight: 800,
                }
            },
        }
    }
    return <Chart type="bar" series={series} options={options} height={height} />
}
export default HorizontalBarApex
import Chart from "react-apexcharts";

const RadialBarApex = ({
    options = {
        labels: ['Debet'],
    },
    series = [80],
    height=300
}) => {
    return <Chart options={options} series={series} type="radialBar" height={height} />
}
export default RadialBarApex;
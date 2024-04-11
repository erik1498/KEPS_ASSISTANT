import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getBulanList } from '../../helper/date.helper';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const StackedBar = ({ data = {
    labels: getBulanList(),
    datasets: [
        {
            label: 'Data',
            data: [10, -12, 45],
            backgroundColor: 'rgba(30, 49, 199, 1)',
        },
    ]
}, indexAxis, legendDisplay = true, yAxisLabelDisplay = true, height = "100%" }) => {

    const options = {
        animation: {
            duration: 0
        },
        indexAxis: indexAxis ? indexAxis : 'x',
        plugins: {
            title: {
                display: false,
            },
            labels: {
                display: false,
            },
            legend: {
                display: legendDisplay
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                max: 100,
                display: false
            },
            y: {
                stacked: true,
                display: yAxisLabelDisplay,
            },
        },
    };

    return <Bar data={data} options={options} height={height} />
}
export default StackedBar
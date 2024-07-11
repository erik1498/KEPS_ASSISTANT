import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getBulanList } from '../../helper/date.helper';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

export const options = {
    // indexAxis: 'y',
    plugins: {
        title: {
            display: false,
            text: 'Chart.js Bar Chart - Stacked',
        },
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};


const Area = ({ data = {
    labels: getBulanList(),
    datasets: [
        {
            label: 'Data',
            data: [10, 12, 45],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(30, 49, 199, 1)',
            borderColor: 'rgba(30, 49, 199, 1)',
        },
    ]
} }) => {
    return <Line data={data} options={options} />
}
export default Area
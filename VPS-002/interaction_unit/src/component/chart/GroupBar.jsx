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


const GroupBar = ({ data = {
    labels: getBulanList(),
    datasets: [
        {
            label: 'Data',
            data: [10, 12, 45],
            backgroundColor: 'rgba(30, 49, 199, 1)',
            stacked: "Stack 0"
        },{
            label: 'Data',
            data: [10, 12, 45],
            backgroundColor: 'rgba(30, 49, 199, 1)',
            stacked: "Stack 1"
        },{
            label: 'Data',
            data: [10, 12, 45],
            backgroundColor: 'rgba(30, 49, 199, 1)',
            stacked: "Stack 2"
        },
    ]
} }) => {
    return <Bar data={data} options={options} />
}
export default GroupBar
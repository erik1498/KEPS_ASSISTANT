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
import { useState } from 'react';
import { Bar } from "react-chartjs-2"
import { getBulanList } from '../../../../helper/date.helper';


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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            display: false,
        },
        title: {
            display: false,
        },
    },
};

const PerubahanModalChart = ({
    data
}) => {

    const [horizontalBarChart, setHorizontalBarChart] = useState({
        labels: getBulanList(),
        datasets: [
            {
                label: 'Saldo',
                data: data.data,
                backgroundColor: data.backgroundColor,
            },
        ]
    })

    return <Bar data={horizontalBarChart} options={options} />
}
export default PerubahanModalChart
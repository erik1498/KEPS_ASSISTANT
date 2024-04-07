
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
import { Bar, Pie } from 'react-chartjs-2';
import { useState } from 'react';
import { useEffect } from 'react';
import { generateNeracaSaldoDataChart } from '../../../../helper/neracaSaldo.helper';

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
    indexAxis: 'y',
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: 'Neraca Saldo',
        },
    },
};

const NeracaSaldoChart = ({
    data
}) => {

    const [horizontalBarChart, setHorizontalBarChart] = useState({
        datasets: [
            {
                label: 'Saldo',
                data: [],
                backgroundColor: 'rgba(30, 58, 138, 1)',
            },
        ]
    })
    const [pieChart, setPieChart] = useState({
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: 'Total Saldo',
                data: [],
                backgroundColor: [],
                borderWidth: 0,
            },
        ]
    })


    useEffect(() => {
        let horizontalBarChartGenerate = generateNeracaSaldoDataChart(data)
        setHorizontalBarChart(horizontalBarChartGenerate.horizontalBarChart)
        setPieChart(horizontalBarChartGenerate.pieChart)
    }, [])

    return <div className="flex">
        <div className="bg-white rounded-md h-full p-3 w-[65vw]">
            <Bar data={horizontalBarChart} options={options} />
        </div>
        <div className="bg-white rounded-md h-full p-3 w-[30vw] ml-2">
            <Pie data={pieChart} />
        </div>
    </div>
}
export default NeracaSaldoChart
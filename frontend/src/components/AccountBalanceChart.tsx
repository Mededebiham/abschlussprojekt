import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { ChartData, ChartOptions } from 'chart.js';
import { format, parseISO } from 'date-fns';
import "./css/AccountBalanceChart.css";


Chart.register(...registerables);

interface AccountBalanceChartProps {
    iban: string;
}

interface BalanceEntry {
    date: string;
    balanceAmount: number;
}

const AccountBalanceChart: React.FC<AccountBalanceChartProps> = ({ iban }) => {
    const [chartData, setChartData] = useState<ChartData<'line'>>({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalanceData = async () => {
            try {
                const response = await axios.get<BalanceEntry[]>(`http://localhost:8088/balances`, {
                    params: { iban }
                });
                const balanceData = response.data;

                console.log(balanceData);

                const dates = balanceData.map((entry) => format(parseISO(entry.date), 'dd-MM-yyyy'));
                const balances = balanceData.map((entry) => entry.balanceAmount);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Kontostand',
                            data: balances,
                            fill: false,
                            backgroundColor: 'rgb(99,101,99)', // Açık gri
                            borderColor: 'rgba(0, 255, 0, 1)', // Açık gri
                        },
                    ],
                })

                setLoading(false);
            } catch (error) {
                console.error('Error fetching balance data:', error);
                setLoading(false);
            }
        };

        fetchBalanceData();
    }, [iban]);

    const options: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    color: 'rgba(192,192,192,0.5)'
                },
                title: {
                    display: true,
                    text: 'Datum',
                    color: 'white',
                },
                ticks: {
                    color: 'white'
                }
            },
            y: {
                grid: {
                    color: 'rgba(192,192,192,0.5)'
                },
                title: {
                    display: true,
                    text: 'Kontostand',
                    color: 'white',
                },
                ticks: {
                    color: 'white'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chart-card">
            <div className="account-balance-chart">
                <h2 style={{ color: 'white' }}>Kontostand Verlauf</h2>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default AccountBalanceChart;

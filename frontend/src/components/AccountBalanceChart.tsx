import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { ChartData, ChartOptions } from 'chart.js';

// Chart.js bileşenlerini ve ölçeklerini kaydedin
Chart.register(...registerables);

interface AccountBalanceChartProps {
    iban: string;
}

interface BalanceEntry {
    date: string;
    balance: number;
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
                const response = await axios.get<BalanceEntry[]>(`http://localhost:8088/bankAccounts/balance-history`, {
                    params: { iban }
                });
                const balanceData = response.data;

                const dates = balanceData.map((entry) => entry.date);
                const balances = balanceData.map((entry) => entry.balance);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Kontostand',
                            data: balances,
                            fill: false,
                            backgroundColor: 'rgba(75,192,192,0.6)',
                            borderColor: 'rgba(75,192,192,1)',
                        },
                    ],
                });

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
                title: {
                    display: true,
                    text: 'Datum'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Kontostand'
                }
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="account-balance-chart">
            <h2>Kontostand Verlauf</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default AccountBalanceChart;

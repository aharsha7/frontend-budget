import { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import api from "../auth/api";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function TransactionCharts() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  const income = transactions.filter((t) => t.type === 'income');
  const expense = transactions.filter((t) => t.type === 'expense');

  // Pie chart: total income vs expense
  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [income.reduce((a, b) => a + b.amount, 0), expense.reduce((a, b) => a + b.amount, 0)],
        backgroundColor: ['#10B981', '#EF4444'],
      },
    ],
  };

  // Bar chart: income vs expense by month (dummy logic)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Income',
        backgroundColor: '#3B82F6',
        data: [3000, 2500, 4000, 3200, 2900],
      },
      {
        label: 'Expense',
        backgroundColor: '#F87171',
        data: [2000, 1800, 2200, 2600, 2100],
      },
    ],
  };

  // Line chart: daily trend (dummy logic)
  const lineData = {
    labels: ['1 Apr', '2 Apr', '3 Apr', '4 Apr', '5 Apr'],
    datasets: [
      {
        label: 'Income',
        data: [500, 700, 600, 800, 750],
        borderColor: '#34D399',
        fill: false,
      },
      {
        label: 'Expense',
        data: [400, 500, 300, 600, 450],
        borderColor: '#F87171',
        fill: false,
      },
    ],
  };

  return (
    <div className="space-y-8 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Transaction Visuals</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-center font-medium">Income vs Expense</h4>
          <Pie data={pieData} />
        </div>
        <div>
          <h4 className="text-center font-medium">Monthly Trend</h4>
          <Bar data={barData} />
        </div>
        <div>
          <h4 className="text-center font-medium">Daily Flow</h4>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default TransactionCharts;

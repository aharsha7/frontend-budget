import { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import api from "../services/ApiUrl";
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
} from "chart.js";
import {
  format,
  startOfMonth,
  endOfMonth,
  subDays,
  startOfWeek,
} from "date-fns";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("daily");
  const [showCharts, setShowCharts] = useState(false);

  // Fetch function
  const fetchTransactions = async () => {
    try {

      const accessToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization:`Bearer ${accessToken}`,
        }
      }
      const res = await axios.get("http://localhost:5000/api/transactions/get", config);
      setTransactions(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(); // initial load once
  }, []); 

  const income = transactions.filter((t) => t.transaction_type === "income");
  const expense = transactions.filter((t) => t.transaction_type === "expense");

  const totalIncome = income.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expense.reduce((a, b) => a + b.amount, 0);

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#10B981", "#EF4444"],
      },
    ],
  };

  const processDailyData = () => {
    const dailyData = {};
    transactions.forEach((t) => {
      const date = format(new Date(t.date), "yyyy-MM-dd");
      if (!dailyData[date]) {
        dailyData[date] = { income: 0, expense: 0 };
      }
      if (t.transaction_type === "income") {
        dailyData[date].income += t.amount;
      } else {
        dailyData[date].expense += t.amount;
      }
    });

    const labels = Object.keys(dailyData);
    const incomeData = labels.map((date) => dailyData[date].income);
    const expenseData = labels.map((date) => dailyData[date].expense);

    return { labels, incomeData, expenseData };
  };

  const processWeeklyData = () => {
    const weeklyData = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const weekStart = format(startOfWeek(date), "yyyy-MM-dd");
      if (!weeklyData[weekStart]) {
        weeklyData[weekStart] = { income: 0, expense: 0 };
      }
      if (t.transaction_type === "income") {
        weeklyData[weekStart].income += t.amount;
      } else {
        weeklyData[weekStart].expense += t.amount;
      }
    });

    const labels = Object.keys(weeklyData);
    const incomeData = labels.map((date) => weeklyData[date].income);
    const expenseData = labels.map((date) => weeklyData[date].expense);

    return { labels, incomeData, expenseData };
  };

  const processMonthlyData = () => {
    const monthlyData = {};
    transactions.forEach((t) => {
      const date = format(new Date(t.date), "yyyy-MM");
      if (!monthlyData[date]) {
        monthlyData[date] = { income: 0, expense: 0 };
      }
      if (t.transaction_type === "income") {
        monthlyData[date].income += t.amount;
      } else {
        monthlyData[date].expense += t.amount;
      }
    });

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map((date) => monthlyData[date].income);
    const expenseData = labels.map((date) => monthlyData[date].expense);

    return { labels, incomeData, expenseData };
  };

  const dailyChartData = processDailyData();
  const weeklyChartData = processWeeklyData();
  const monthlyChartData = processMonthlyData();

  const barChartData = {
    labels: monthlyChartData.labels,
    datasets: [
      {
        label: "Income",
        backgroundColor: "#3B82F6",
        data: monthlyChartData.incomeData,
      },
      {
        label: "Expense",
        backgroundColor: "#F87171",
        data: monthlyChartData.expenseData,
      },
    ],
  };

  const lineChartData = {
    labels: dailyChartData.labels,
    datasets: [
      {
        label: "Income",
        data: dailyChartData.incomeData,
        borderColor: "#34D399",
        fill: false,
      },
      {
        label: "Expense",
        data: dailyChartData.expenseData,
        borderColor: "#F87171",
        fill: false,
      },
    ],
  };

  const weeklyLineChartData = {
    labels: weeklyChartData.labels,
    datasets: [
      {
        label: "Income",
        data: weeklyChartData.incomeData,
        borderColor: "#34D399",
        fill: false,
      },
      {
        label: "Expense",
        data: weeklyChartData.expenseData,
        borderColor: "#F87171",
        fill: false,
      },
    ],
  };

  const getChartData = () => {
    switch (view) {
      case "daily":
        return lineChartData;
      case "weekly":
        return weeklyLineChartData;
      case "monthly":
        return barChartData;
      default:
        return lineChartData;
    }
  };

  return (
    <div>
        <div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-900 transition mb-4"
            >
              {showCharts ? "Hide Charts" : "Show Charts"}
            </button>
          </div>

          {showCharts && (
            <div>
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={() => setView("daily")}
                  className="hover:underline btn btn-primary"
                >
                  Daily
                </button>
                <button
                  onClick={() => setView("weekly")}
                  className="hover:underline btn btn-primary"
                >
                  Weekly
                </button>
                <button
                  onClick={() => setView("monthly")}
                  className="hover:underline btn btn-primary"
                >
                  Monthly
                </button>
              </div>

              <div className="flex flex-row gap-8">
                <div style={{ width: "900px", height: "500px" }}>
                  {view === "daily" && (
                    <>
                      <h4 className="text-center font-medium">Daily Flow</h4>
                      <Line data={getChartData()} />
                    </>
                  )}
                  {view === "weekly" && (
                    <>
                      <h4 className="text-center font-medium">Weekly Flow</h4>
                      <Line data={getChartData()} />
                    </>
                  )}
                  {view === "monthly" && (
                    <>
                      <h4 className="text-center font-medium">Monthly Trend</h4>
                      <Bar data={getChartData()} />
                    </>
                  )}
                </div>

                <div className="ml-12" style={{ width: "400px", height: "400px" }}>
                  <h4 className="text-center font-medium">Income vs Expense</h4>
                  <Pie
                    data={pieData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

export default TransactionCharts;

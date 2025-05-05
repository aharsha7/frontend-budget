import { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import api from "../services/ApiUrl"; // Adjust the import path as necessary
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
  endOfWeek,
} from "date-fns"; // Import date-fns functions

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
  const [view, setView] = useState("daily"); // Default view set to 'daily'
  const [showCharts, setShowCharts] = useState(false); // State to toggle chart visibility

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/transactions/get");
        setTransactions(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 1. Process Data for Pie Chart (Income vs Expense)
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

  // 2. Data Processing Functions (Daily, Weekly, Monthly)
  const processDailyData = () => {
    const dailyData = {};
    transactions.forEach((t) => {
      const date = format(new Date(t.date), "yyyy-MM-dd"); // Use date-fns to format the date
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
      const date = format(new Date(t.date), "yyyy-MM"); // Group by year and month
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

  // 3. Generate Chart Data
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

  // Weekly Chart Data
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

  // Handling the chart display based on the selected view
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
    <div className="space-y-8 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Transaction Visuals</h2>

      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div>
          {/* Button to toggle chart visibility */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="btn btn-primary"
            >
              {showCharts ? "Hide Charts" : "Show Charts"}
            </button>
          </div>

          {/* Show charts only if showCharts is true */}
          {showCharts && (
            <div>
              {/* Buttons to switch between views */}
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={() => setView("daily")}
                  className="btn btn-primary"
                >
                  Daily
                </button>
                <button
                  onClick={() => setView("weekly")}
                  className="btn btn-primary"
                >
                  Weekly
                </button>
                <button
                  onClick={() => setView("monthly")}
                  className="btn btn-primary"
                >
                  Monthly
                </button>
              </div>

              {/* Display selected chart */}
              {view === "daily" && (
                <div>
                  <h4 className="text-center font-medium">Daily Flow</h4>
                  <Line data={getChartData()} />
                </div>
              )}
              {view === "weekly" && (
                <div>
                  <h4 className="text-center font-medium">Weekly Flow</h4>
                  <Line data={getChartData()} />
                </div>
              )}
              {view === "monthly" && (
                <div>
                  <h4 className="text-center font-medium">Monthly Trend</h4>
                  <Bar data={getChartData()} />
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <div style={{ width: "400px", height: "400px" }}>
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
      )}
    </div>
  );
}

export default TransactionCharts;

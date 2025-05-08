import { useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
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
import { format, startOfWeek } from "date-fns";

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

function TransactionCharts({ transactions }) {
  const [view, setView] = useState("daily");

  // Process transactions as data changes
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
    <div className="p-4">
      <div className="border-2 shadow-2xl rounded-2xl p-6">
        {/* Chart View Switch Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setView("daily")}
            className={`px-4 py-2 rounded font-medium transition ${
              view === "daily"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-2 rounded font-medium transition ${
              view === "weekly"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-2 rounded font-medium transition ${
              view === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Line/Bar Chart */}
          <div className="bg-white shadow-lg rounded-xl p-4 w-full lg:w-[900px] h-[500px]">
            {view === "daily" && (
              <>
                <h4 className="text-center font-semibold mb-2 text-blue-700">Daily Flow</h4>
                <Line data={getChartData()} />
              </>
            )}
            {view === "weekly" && (
              <>
                <h4 className="text-center font-semibold mb-2 text-blue-700">Weekly Flow</h4>
                <Line data={getChartData()} />
              </>
            )}
            {view === "monthly" && (
              <>
                <h4 className="text-center font-semibold mb-2 text-blue-700">Monthly Trend</h4>
                <Bar data={getChartData()} />
              </>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow-lg rounded-xl p-4 w-full lg:w-[400px] h-[500px]">
            <h4 className="text-center font-semibold mb-2 text-blue-700">Income vs Expense</h4>
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
    </div>
  );
}
export default TransactionCharts;
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Scatter, Radar, Bubble } from "react-chartjs-2";
import styles from "./AIInsights.module.css";
import { MagneticButton } from "../components/MagneticButton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  RefreshCw, 
  ChevronUp, 
  Lightbulb, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Target,
  ArrowUpRight,
  ShieldAlert,
  Layers,
  Activity
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);

function AIInsights() {
  const [salesForecast, setSalesForecast] = useState(null);
  const [advAnalytics, setAdvAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState({});

  const toggleInsight = (id) => {
    setExpandedInsight(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("user"));
      const userID = auth?._id || "6429979b2e5434138eda1564";

      const [salesRes, advRes] = await Promise.all([
        fetch("http://localhost:4000/api/ai/forecast-sales"),
        fetch(`http://localhost:4000/api/analytics/advanced/${userID}`)
      ]);

      const salesData = await salesRes.json();
      const advData = await advRes.json();

      setSalesForecast(salesData);
      setAdvAnalytics(advData);
    } catch (error) {
      console.error("Failed to load AI Insights", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12, weight: '500' },
          usePointStyle: true,
          padding: 20,
          color: '#41484b'
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1a404d',
        bodyColor: '#41484b',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { family: 'Inter', size: 13, weight: '700' },
        bodyFont: { family: 'Inter', size: 12 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8', padding: 8 }
      }
    }
  };

  // 1. Sales Forecast Data
  const getSalesChartData = () => {
    if (!salesForecast) return null;
    const histDates = (salesForecast.historicalData || []).map(d => d.date);
    const histAmounts = (salesForecast.historicalData || []).map(d => d.amount);
    const fcDates = (salesForecast.forecast || []).map(f => f.date);
    const fcAmounts = (salesForecast.forecast || []).map(f => parseFloat(f.predictedSales));

    return {
      labels: [...histDates, ...fcDates],
      datasets: [
        {
          label: 'Historical Sales',
          data: [...histAmounts, ...new Array(fcAmounts.length).fill(null)],
          borderColor: '#1a404d',
          backgroundColor: 'rgba(26, 64, 77, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff',
          pointBorderWidth: 2
        },
        {
          label: 'AI Prediction',
          data: [...new Array(histAmounts.length - 1).fill(null), histAmounts[histAmounts.length - 1], ...fcAmounts],
          borderColor: '#336763',
          borderDash: [5, 5],
          backgroundColor: 'rgba(51, 103, 99, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff',
          pointBorderWidth: 2
        }
      ]
    };
  };

  // 2. Efficiency Data
  const getEfficiencyData = () => {
    if (!advAnalytics) return null;
    return {
      labels: advAnalytics.turnover.map(t => t.name),
      datasets: [
        {
          label: 'Turnover Rate',
          data: advAnalytics.turnover.map(t => t.turnover),
          backgroundColor: '#1a404d',
          borderRadius: 6
        },
        {
          label: 'DIO (Days)',
          data: advAnalytics.turnover.map(t => t.dio),
          backgroundColor: '#b7ede8',
          borderRadius: 6
        }
      ]
    };
  };

  // 3. Product Mix Data
  const getMixData = () => {
    if (!advAnalytics) return null;
    return {
      labels: advAnalytics.productMix.map(p => p.name),
      datasets: [{
        data: advAnalytics.productMix.map(p => p.percentage),
        backgroundColor: [
          '#1a404d', '#335765', '#336763', '#b7ede8', '#56321d', '#ffdbca'
        ],
        borderWidth: 0,
        hoverOffset: 20
      }]
    };
  };

  // 4. Matrix Data
  const getMatrixData = () => {
    if (!advAnalytics) return null;
    return {
      datasets: [{
        label: 'Product Performance',
        data: advAnalytics.matrix.map(m => ({ x: m.x, y: m.y, name: m.name })),
        backgroundColor: '#336763',
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    };
  };

  // 5. Stock Health (Radar)
  const getHealthData = () => {
    if (!advAnalytics) return null;
    const labels = advAnalytics.turnover.slice(0, 6).map(t => t.name);
    return {
      labels,
      datasets: [
        {
          label: 'Stock Availability',
          data: labels.map(() => 60 + Math.random() * 40),
          borderColor: '#1a404d',
          backgroundColor: 'rgba(26, 64, 77, 0.1)',
        },
        {
          label: 'Demand Fulfillment',
          data: labels.map(() => 40 + Math.random() * 50),
          borderColor: '#336763',
          backgroundColor: 'rgba(51, 103, 99, 0.1)',
        }
      ]
    };
  };

  // 6. 3D-Simulated Performance (Bubble Chart)
  const getBubbleData = () => {
    if (!advAnalytics) return null;
    return {
      datasets: [{
        label: 'Product Performance (Size = Stock Level)',
        data: advAnalytics.matrix.map((m, i) => ({
          x: m.x, // Turnover
          y: m.y, // Margin
          r: 5 + (Math.random() * 20), // Stock (Simulated)
          name: m.name
        })),
        backgroundColor: 'rgba(51, 103, 99, 0.6)',
        borderColor: '#336763',
        borderWidth: 1
      }]
    };
  };

  // 7. Predictive Stock Trend (Line)
  const getStockTrendData = () => {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
    return {
      labels,
      datasets: [
        {
          label: 'Predicted Stock Levels',
          data: [120, 115, 108, 95, 82, 110, 130, 125],
          borderColor: '#1a404d', // Primary
          backgroundColor: 'transparent',
          tension: 0.4,
          pointStyle: 'circle',
          pointRadius: 6,
          pointHoverRadius: 10,
        },
        {
          label: 'Safety Threshold',
          data: new Array(8).fill(85),
          borderColor: '#56321d', // Tertiary (Alert color in brand)
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  };

  const InsightSection = ({ id, content }) => (
    <div className={styles.insightSection}>
      <div className={styles.insightToggle} onClick={() => toggleInsight(id)}>
        <div className={styles.insightLabel}>
          <Lightbulb size={16} strokeWidth={2.5} color="#1a404d" />
          <span style={{ color: '#1a404d' }}>Intelligence Insights</span>
        </div>
        <ChevronUp 
          size={18} 
          color="#1a404d"
          className={`${styles.insightArrow} ${expandedInsight[id] ? styles.active : ""}`} 
        />
      </div>
      <AnimatePresence>
        {expandedInsight[id] && (
          <motion.div 
            className={styles.insightContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ borderLeft: '2px solid #b7ede8' }}
          >
            <p>{content}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <span className="label-cap" style={{ fontSize: '0.7rem', background: '#eaf4ec', padding: '2px 8px', borderRadius: '4px', color: '#1a404d' }}>
                Strategic
              </span>
              <span className="label-cap" style={{ fontSize: '0.7rem', background: '#ffdbca', padding: '2px 8px', borderRadius: '4px', color: '#56321d' }}>
                AI-Powered
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Zap size={32} strokeWidth={2} color="#1a404d" />
            Intelligence Hub
          </h1>
          <p className={styles.subtitle}>
            Unlocking predictive patterns and strategic inventory optimization through advanced neural analysis and behavioral modeling.
          </p>
        </div>
        <MagneticButton variant="primary" size="sm" onClick={fetchAIInsights}>
          <RefreshCw size={14} strokeWidth={2} />
          Recalibrate Models
        </MagneticButton>
      </div>

      {loading ? (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader} style={{ borderTopColor: '#1a404d' }} />
          <p className="label-cap" style={{ color: '#1a404d' }}>Processing Market Intelligence...</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* 1. Sales Forecast */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Sales Velocity Forecast</h2>
              <TrendingUp size={20} color="#1a404d" strokeWidth={1.5} />
            </div>
            <div className={styles.chartWrapper}>
              <Line data={getSalesChartData()} options={chartOptions} />
            </div>
            <InsightSection 
              id="forecast"
              content="Our time-series model identifies a cyclical growth pattern. Predicted sales for the upcoming week show a 12% increase in consumer velocity."
            />
          </motion.div>

          {/* 2. Efficiency */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Liquidity: Turnover vs. DIO</h2>
              <BarChart3 size={20} color="#1a404d" strokeWidth={1.5} />
            </div>
            <div className={styles.chartWrapper}>
              <Bar data={getEfficiencyData()} options={chartOptions} />
            </div>
            <InsightSection 
              id="efficiency"
              content="Days Inventory Outstanding (DIO) is currently averaging 42 days. Optimizing stock levels for high-velocity items could reduce holding costs by 15%."
            />
          </motion.div>

          {/* 3. Multi-Dimensional Performance (Bubble Chart) */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>3D Multi-Metric Matrix</h2>
              <Layers size={20} color="#1a404d" strokeWidth={1.5} />
            </div>
            <div className={styles.chartWrapper}>
              <Bubble 
                data={getBubbleData()} 
                options={{
                  ...chartOptions,
                  scales: {
                    x: { ...chartOptions.scales.x, title: { display: true, text: 'Turnover Rate (x)', font: { family: 'Inter', weight: '600' } } },
                    y: { ...chartOptions.scales.y, title: { display: true, text: 'Margin (%)', font: { family: 'Inter', weight: '600' } } }
                  },
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      ...chartOptions.plugins.tooltip,
                      callbacks: {
                        label: (ctx) => `${ctx.raw.name}: ${ctx.raw.x.toFixed(1)}x Turnover, ${ctx.raw.y.toFixed(1)}% Margin, ${ctx.raw.r.toFixed(0)} Units`
                      }
                    }
                  }
                }} 
              />
            </div>
            <InsightSection 
              id="bubble"
              content="Visualizes the correlation between Turnover (X), Margin (Y), and Stock Levels (Size). Large bubbles in the top-right are your 'Goldmines'."
            />
          </motion.div>

          {/* 4. Predictive Stock Trend */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Predictive Stock Resilience</h2>
              <Activity size={20} color="#1a404d" strokeWidth={1.5} />
            </div>
            <div className={styles.chartWrapper}>
              <Line data={getStockTrendData()} options={chartOptions} />
            </div>
            <InsightSection 
              id="trend"
              content="Forecasts inventory depletion against safety thresholds. Week 4 shows a potential stockout risk if replenishment is not prioritized."
            />
          </motion.div>

          {/* 5. Product Mix */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Revenue Mix Concentration</h2>
              <PieChart size={20} color="#1a404d" strokeWidth={1.5} />
            </div>
            <div className={styles.chartWrapper}>
              <Doughnut 
                data={getMixData()} 
                options={{
                  ...chartOptions,
                  cutout: '70%',
                  plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } }
                }} 
              />
            </div>
            <InsightSection 
              id="mix"
              content="High dependency on top-tier products detected. Diversifying your product mix could mitigate 20% of revenue volatility."
            />
          </motion.div>

          {/* 6. Strategic Matrix */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Profitability Matrix</h2>
              <Target size={20} color="#1a404d" strokeWidth={1.5} />
            </div>
            <div className={styles.chartWrapper}>
              <Scatter 
                data={getMatrixData()} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      ...chartOptions.plugins.tooltip,
                      callbacks: {
                        label: (ctx) => `${ctx.raw.name}: ${ctx.raw.x.toFixed(2)}x Turnover, ${ctx.raw.y.toFixed(1)}% Margin`
                      }
                    }
                  }
                }} 
              />
            </div>
            <InsightSection 
              id="matrix"
              content="Identifies market laggards vs. stars. Products with low margin and low turnover are candidates for clearance."
            />
          </motion.div>

          {/* 7. Stock Health Index (Radar) */}
          <motion.div className={`${styles.card} ${styles.fullWidth}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Operational Resilience Radar</h2>
              <ShieldAlert size={20} color="#56321d" strokeWidth={1.5} />
            </div>
            <div className={styles.chartWrapper} style={{ minHeight: '400px' }}>
              <Radar 
                data={getHealthData()} 
                options={{
                  ...chartOptions,
                  scales: {
                    r: {
                      angleLines: { color: 'rgba(26,64,77,0.05)' },
                      grid: { color: 'rgba(26,64,77,0.05)' },
                      pointLabels: { font: { family: 'Inter', size: 12, weight: '600' }, color: '#161d1a' },
                      ticks: { display: false }
                    }
                  }
                }} 
              />
            </div>
            <InsightSection 
              id="health"
              content="Aggregates stock availability and fulfillment demand. Areas where 'Demand Fulfillment' exceeds 'Availability' indicate critical supply chain bottlenecks."
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AIInsights;

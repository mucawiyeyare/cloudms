// =====================================================
// ANALYTICS VIEW - Dashboard Charts & Statistics
// Uses Chart.js via react-chartjs-2
// =====================================================
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import api from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// A nice palette
const PALETTE = ['#4F46E5','#10B981','#F59E0B','#EF4444','#3B82F6','#8B5CF6','#EC4899','#06B6D4','#84CC16','#F97316'];

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <span>{icon}</span>
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function AnalyticsView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/surveys/stats');
        setStats(res.data);
      } catch {
        setError('Xogta la soo qaadi kari waayay. Fadlan dib u eeg xiriirka.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!stats)  return null;

  // Helpers
  const toChartData = (agg, labelMap = {}) => ({
    labels: agg.map((d) => labelMap[d._id] || d._id || 'Aan la garanin'),
    datasets: [{ data: agg.map((d) => d.count), backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff' }],
  });

  const toBarData = (agg, labelKey = '_id') => ({
    labels: agg.map((d) => (d[labelKey] || 'Aan la garanin').substring(0, 30)),
    datasets: [{
      label: 'Tiro',
      data: agg.map((d) => d.count),
      backgroundColor: PALETTE[0] + 'CC',
      borderColor: PALETTE[0],
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  });

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 14 } }, title: { display: false } },
  });

  const barOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      x: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 11 } } },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  });

  // Compute derived stats
  const adopted = stats.adoption?.find((d) => d._id === 'Haa, way isticmaashaa')?.count || 0;
  const adoptionPct = stats.totalResponses ? Math.round((adopted / stats.totalResponses) * 100) : 0;
  const topSector = stats.sectors?.[0]?._id || 'N/A';
  const highAwarenessCount = stats.awareness?.filter((d) => d._id === 'Sarreeya' || d._id === 'Aad u sarreeya').reduce((s, d) => s + d.count, 0) || 0;

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard icon="📋" value={stats.totalResponses} label="Wadarta Jawaabaha" color="purple" />
        <StatCard icon="☁️" value={`${adoptionPct}%`} label="Isticmaalka Cloud-ka" color="green" />
        <StatCard icon="🏢" value={stats.sectors?.length || 0} label="Noocyada Ganacsiga" color="amber" />
        <StatCard icon="💡" value={highAwarenessCount} label="Wacyi Sare (Cloud)" color="blue" />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        {/* Awareness Distribution - Doughnut */}
        <div className="chart-card">
          <div className="chart-title">🧠 Heerka Wacyiga Cloud Computing</div>
          <div className="chart-subtitle">Sidee ay respondents u qiimeeyaan aqoontooda</div>
          {stats.awareness?.length > 0
            ? <Doughnut data={toChartData(stats.awareness)} options={chartOptions()} />
            : <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Xog ma jirto</p>
          }
        </div>

        {/* Adoption Status - Pie */}
        <div className="chart-card">
          <div className="chart-title">☁️ Qaadashada Cloud (Adoption)</div>
          <div className="chart-subtitle">Ma isticmaalaan qalab Cloud-ka?</div>
          {stats.adoption?.length > 0
            ? <Pie data={toChartData(stats.adoption)} options={chartOptions()} />
            : <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Xog ma jirto</p>
          }
        </div>

        {/* Sectors - Bar */}
        <div className="chart-card full-width" style={{ height: '360px' }}>
          <div className="chart-title">🏢 Qaybaha Ganacsiga (Sectors)</div>
          <div className="chart-subtitle">Tirada respondents ee qaybta kasta</div>
          <div style={{ height: '280px' }}>
            {stats.sectors?.length > 0
              ? <Bar data={toBarData(stats.sectors)} options={barOptions()} />
              : <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Xog ma jirto</p>
            }
          </div>
        </div>

        {/* Cloud Tools - Bar */}
        <div className="chart-card full-width" style={{ height: '380px' }}>
          <div className="chart-title">🛠️ Qalabka Cloud ee la Isticmaalo</div>
          <div className="chart-subtitle">Adeegyada ugu caansan</div>
          <div style={{ height: '290px' }}>
            {stats.cloudTools?.length > 0
              ? <Bar data={toBarData(stats.cloudTools)} options={barOptions()} />
              : <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Xog ma jirto</p>
            }
          </div>
        </div>

        {/* Storage Methods - Doughnut */}
        <div className="chart-card">
          <div className="chart-title">💾 Hababka Kaydinta Xogta</div>
          <div className="chart-subtitle">Sida respondents ay xogta u kaydsadaan</div>
          {stats.storage?.length > 0
            ? <Doughnut data={toChartData(stats.storage)} options={chartOptions()} />
            : <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Xog ma jirto</p>
          }
        </div>

        {/* Challenges - Doughnut */}
        <div className="chart-card">
          <div className="chart-title">⚠️ Caqabadaha Ugu Weyn</div>
          <div className="chart-subtitle">Caqabadda ugu weyn ee teknoolojiyadda</div>
          {stats.challenges?.length > 0
            ? <Doughnut data={toChartData(stats.challenges)} options={chartOptions()} />
            : <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Xog ma jirto</p>
          }
        </div>
      </div>
    </div>
  );
}

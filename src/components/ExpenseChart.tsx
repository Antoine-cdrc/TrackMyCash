import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import { useState, useEffect } from 'react';
import { databaseService } from '../services/DatabaseService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const colors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40'
];

const ExpenseChart: React.FC = () => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [categoryData, setCategoryData] = useState<{ category: string; total: number }[]>([]);

  const loadData = async () => {
    try {
      const data = await databaseService.getExpensesByCategory();
      setCategoryData(data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const chartData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        label: 'Dépenses',
        data: categoryData.map(item => item.total),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: function(chart: any) {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label: string, i: number) => ({
              text: `${label} (${datasets[0].data[i].toFixed(2)} €)`,
              fillStyle: datasets[0].backgroundColor[i],
              strokeStyle: datasets[0].borderColor[i],
              lineWidth: 1,
              hidden: false,
              index: i
            }));
          }
        }
      },
      title: {
        display: true,
        text: 'Répartition des dépenses par catégorie',
        font: {
          size: 16
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toFixed(2)} € (${percentage}%)`;
          }
        }
      }
    }
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Montant (€)'
        }
      }
    }
  };

  return (
    <div>
      <IonSegment value={chartType} onIonChange={e => setChartType(e.detail.value as 'pie' | 'bar')}>
        <IonSegmentButton value="pie">
          <IonLabel>Camembert</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="bar">
          <IonLabel>Barres</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <div style={{ padding: '20px' }}>
        {chartType === 'pie' ? (
          <Pie data={chartData} options={commonOptions} />
        ) : (
          <Bar data={chartData} options={barOptions} />
        )}
      </div>
    </div>
  );
};

export default ExpenseChart; 
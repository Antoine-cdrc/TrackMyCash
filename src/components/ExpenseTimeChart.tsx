import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { databaseService } from '../services/DatabaseService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyExpense {
  month: string;
  total: number;
}

interface CategoryMonthlyExpense {
  category: string;
  monthlyData: MonthlyExpense[];
}

const colors = [
  '#FF6384', // Rouge
  '#36A2EB', // Bleu
  '#FFCE56', // Jaune
  '#4BC0C0', // Turquoise
  '#9966FF', // Violet
  '#FF9F40', // Orange
  '#8AC249', // Vert
  '#EA526F', // Rose
  '#23B5D3', // Bleu clair
  '#279AF1'  // Bleu ciel
];

const ExpenseTimeChart: React.FC = () => {
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryMonthlyExpense[]>([]);

  const loadData = async () => {
    try {
      const expenses = await databaseService.getExpenses();
      
      // Obtenir toutes les catégories uniques
      const categories = Array.from(new Set(expenses.map(exp => exp.category)));

      // Grouper les dépenses par catégorie et par mois
      const categoryData = categories.map(category => {
        const categoryExpenses = expenses.filter(exp => exp.category === category);
        
        // Grouper par mois
        const monthlyData = categoryExpenses.reduce((acc: { [key: string]: number }, expense) => {
          const date = new Date(expense.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
          return acc;
        }, {});

        // Convertir en tableau et trier par mois
        const sortedMonthlyData = Object.entries(monthlyData)
          .map(([month, total]) => ({ month, total }))
          .sort((a, b) => a.month.localeCompare(b.month));

        return {
          category,
          monthlyData: sortedMonthlyData
        };
      });

      setCategoryExpenses(categoryData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Obtenir toutes les dates uniques pour les labels
  const allMonths = Array.from(new Set(
    categoryExpenses.flatMap(cat => cat.monthlyData.map(data => data.month))
  )).sort();

  const data = {
    labels: allMonths.map(month => {
      const [year, monthNum] = month.split('-');
      return `${monthNum}/${year}`;
    }),
    datasets: categoryExpenses.map((categoryData, index) => ({
      label: categoryData.category,
      data: allMonths.map(month => {
        const monthData = categoryData.monthlyData.find(d => d.month === month);
        return monthData ? monthData.total : 0;
      }),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.1,
      fill: false
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des dépenses par catégorie'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string) {
            if (typeof tickValue === 'number') {
              return `${tickValue.toFixed(2)} €`;
            }
            return tickValue;
          }
        }
      }
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Évolution des Dépenses par Catégorie</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <Line data={data} options={options} />
      </IonCardContent>
    </IonCard>
  );
};

export default ExpenseTimeChart; 
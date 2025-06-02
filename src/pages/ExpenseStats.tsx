import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, useIonToast, IonSegment, IonSegmentButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import { databaseService } from '../services/DatabaseService';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseTimeChart from '../components/ExpenseTimeChart';
import { expenseUpdated } from '../services/EventService';

interface CategoryTotal {
  category: string;
  total: number;
}

const ExpenseStats: React.FC = () => {
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'list' | 'chart' | 'time'>('list');
  const [present] = useIonToast();

  const loadStats = async () => {
    try {
      const [totals, total] = await Promise.all([
        databaseService.getExpensesByCategory(),
        databaseService.getTotalExpenses()
      ]);

      setCategoryTotals(totals);
      setTotalExpenses(total);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      present({
        message: 'Erreur lors du chargement des statistiques',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  useEffect(() => {
    loadStats();
    const subscription = expenseUpdated.subscribe(() => {
      loadStats();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Récapitulatif</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Total des Dépenses</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h2>{totalExpenses.toFixed(2)} €</h2>
          </IonCardContent>
        </IonCard>

        <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as 'list' | 'chart' | 'time')}>
          <IonSegmentButton value="list">
            <IonLabel>Liste</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="chart">
            <IonLabel>Répartition</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="time">
            <IonLabel>Évolution</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {viewMode === 'list' && (
          <IonList>
            {categoryTotals.map((category) => (
              <IonItem key={category.category}>
                <IonLabel>
                  <h2>{category.category}</h2>
                </IonLabel>
                <IonLabel slot="end">
                  {category.total.toFixed(2)} €
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {viewMode === 'chart' && <ExpenseChart />}
        {viewMode === 'time' && <ExpenseTimeChart />}
      </IonContent>
    </IonPage>
  );
};

export default ExpenseStats; 
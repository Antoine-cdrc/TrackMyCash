import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, useIonToast } from '@ionic/react';
import { useState, useEffect } from 'react';
import { databaseService, Expense } from '../services/DatabaseService';
import { trash } from 'ionicons/icons';

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [present] = useIonToast();

  const loadExpenses = async () => {
    try {
      const loadedExpenses = await databaseService.getExpenses();
      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Erreur lors du chargement des dépenses:', error);
      present({
        message: 'Erreur lors du chargement des dépenses',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await databaseService.deleteExpense(id);
      await loadExpenses();
      present({
        message: 'Dépense supprimée avec succès',
        duration: 2000,
        color: 'success'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      present({
        message: 'Erreur lors de la suppression',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mes Dépenses</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {expenses.map((expense) => (
            <IonItem key={expense.id}>
              <IonLabel>
                <h2>{expense.name}</h2>
                <p>{new Date(expense.date).toLocaleDateString()} - {expense.category}</p>
              </IonLabel>
              <IonBadge slot="end" color="danger">
                {expense.amount.toFixed(2)} €
              </IonBadge>
              <IonButton
                fill="clear"
                color="danger"
                onClick={() => handleDelete(expense.id!)}
              >
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ExpenseList; 
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, useIonToast, IonRefresher, IonRefresherContent, IonSpinner, IonSelect, IonSelectOption } from '@ionic/react';
import { useState, useEffect, useCallback } from 'react';
import { databaseService, Expense } from '../services/DatabaseService';
import { trash } from 'ionicons/icons';

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [present] = useIonToast();

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const loadedExpenses = await databaseService.getExpenses();
      setExpenses(loadedExpenses);
      
      // Extraire les catégories uniques
      const uniqueCategories = Array.from(new Set(loadedExpenses.map(exp => exp.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des dépenses:', error);
      present({
        message: 'Erreur lors du chargement des dépenses',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  }, [present]);

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

  const handleRefresh = async (event: CustomEvent) => {
    await loadExpenses();
    event.detail.complete();
  };

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const filteredExpenses = selectedCategory
    ? expenses.filter(expense => expense.category === selectedCategory)
    : expenses;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mes Dépenses</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonItem>
          <IonLabel>Filtrer par catégorie</IonLabel>
          <IonSelect
            value={selectedCategory}
            placeholder="Toutes les catégories"
            onIonChange={e => setSelectedCategory(e.detail.value)}
          >
            <IonSelectOption value="">Toutes les catégories</IonSelectOption>
            {categories.map(category => (
              <IonSelectOption key={category} value={category}>
                {category}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="ion-text-center ion-padding">
            <p>Aucune dépense enregistrée</p>
          </div>
        ) : (
          <IonList>
            {filteredExpenses.map((expense) => (
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
        )}
      </IonContent>
    </IonPage>
  );
};

export default ExpenseList; 
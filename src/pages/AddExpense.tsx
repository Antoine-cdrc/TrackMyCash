import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonDatetime, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { databaseService } from '../services/DatabaseService';
import { useHistory } from 'react-router-dom';

const categories = [
  'Loisir',
  'Nourriture',
  'Logement',
  'Transport',
  'Santé',
  'Autres'
];

const AddExpense: React.FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [present] = useIonToast();
  const history = useHistory();

  const handleSubmit = async () => {
    try {
      if (!name || !amount || !category) {
        present({
          message: 'Veuillez remplir tous les champs',
          duration: 2000,
          color: 'danger'
        });
        return;
      }

      const newExpense = {
        name,
        amount: parseFloat(amount),
        category,
        date
      };

      await databaseService.addExpense(newExpense);
      
      present({
        message: 'Dépense ajoutée avec succès',
        duration: 2000,
        color: 'success'
      });

      // Réinitialiser le formulaire
      setName('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString());

      // Rediriger vers la liste
      history.push('/list');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error);
      present({
        message: 'Erreur lors de l\'ajout de la dépense',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ajouter une Dépense</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Nom de la dépense</IonLabel>
          <IonInput
            value={name}
            onIonChange={e => setName(e.detail.value!)}
            placeholder="Ex: Courses"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Montant (€)</IonLabel>
          <IonInput
            type="number"
            value={amount}
            onIonChange={e => setAmount(e.detail.value!)}
            placeholder="0.00"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Catégorie</IonLabel>
          <IonSelect
            value={category}
            onIonChange={e => setCategory(e.detail.value)}
            placeholder="Sélectionner une catégorie"
          >
            {categories.map(cat => (
              <IonSelectOption key={cat} value={cat}>{cat}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Date</IonLabel>
          <IonDatetime
            value={date}
            onIonChange={e => setDate(e.detail.value as string)}
            presentation="date"
          />
        </IonItem>

        <IonButton expand="block" onClick={handleSubmit} className="ion-margin">
          Ajouter la dépense
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddExpense; 
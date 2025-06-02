import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonDatetime, IonList, IonIcon, useIonToast, IonBackButton, IonButtons } from '@ionic/react';
import { useState } from 'react';
import { databaseService } from '../services/DatabaseService';
import { useHistory } from 'react-router-dom';
import { calendar, cash, list, save } from 'ionicons/icons';

const categories = [
  'Nourriture',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Autres'
];

const AddExpense: React.FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !category || !date) {
      present({
        message: 'Veuillez remplir tous les champs',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    const amountValue = parseFloat(amount.replace(',', '.'));
    if (isNaN(amountValue) || amountValue <= 0) {
      present({
        message: 'Le montant doit être un nombre positif',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await databaseService.addExpense({
        name,
        amount: amountValue,
        category,
        date: new Date(date).toISOString()
      });

      present({
        message: 'Dépense ajoutée avec succès',
        duration: 2000,
        color: 'success'
      });

      // Attendre un peu pour que le message soit visible
      setTimeout(() => {
        history.push('/list');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error);
      present({
        message: 'Erreur lors de l\'ajout de la dépense',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/list" />
          </IonButtons>
          <IonTitle>Nouvelle Dépense</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">
                <IonIcon icon={list} className="ion-margin-end" />
                Nom de la dépense
              </IonLabel>
              <IonInput
                value={name}
                onIonChange={e => setName(e.detail.value!)}
                placeholder="Ex: Courses alimentaires"
                disabled={isSubmitting}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                <IonIcon icon={cash} className="ion-margin-end" />
                Montant (€)
              </IonLabel>
              <IonInput
                type="text"
                inputmode="decimal"
                value={amount}
                onIonChange={e => {
                  const value = e.detail.value!;
                  // Permettre uniquement les nombres, virgule et point
                  if (/^[0-9]*[,.]?[0-9]*$/.test(value)) {
                    setAmount(value);
                  }
                }}
                placeholder="0.00"
                disabled={isSubmitting}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                <IonIcon icon={list} className="ion-margin-end" />
                Catégorie
              </IonLabel>
              <IonSelect
                value={category}
                onIonChange={e => setCategory(e.detail.value)}
                placeholder="Sélectionner une catégorie"
                disabled={isSubmitting}
                interface="action-sheet"
              >
                {categories.map(cat => (
                  <IonSelectOption key={cat} value={cat}>
                    {cat}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                <IonIcon icon={calendar} className="ion-margin-end" />
                Date
              </IonLabel>
              <IonDatetime
                value={date}
                onIonChange={e => {
                  const value = e.detail.value;
                  if (typeof value === 'string') {
                    setDate(value);
                  }
                }}
                presentation="date"
                locale="fr-FR"
                disabled={isSubmitting}
                max={new Date().toISOString()}
              />
            </IonItem>
          </IonList>

          <div className="ion-padding">
            <IonButton
              expand="block"
              type="submit"
              disabled={isSubmitting}
            >
              <IonIcon icon={save} className="ion-margin-end" />
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter la dépense'}
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddExpense; 
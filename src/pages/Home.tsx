import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { list, statsChart, add } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import ExpenseStats from './ExpenseStats';
import AddExpense from './AddExpense';

const Home: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/list" component={ExpenseList} />
        <Route exact path="/stats" component={ExpenseStats} />
        <Route exact path="/add" component={AddExpense} />
        <Route exact path="/">
          <Redirect to="/list" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="list" href="/list">
          <IonIcon icon={list} />
          <IonLabel>Liste</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href="/stats">
          <IonIcon icon={statsChart} />
          <IonLabel>Récapitulatif</IonLabel>
        </IonTabButton>
        <IonTabButton tab="add" href="/add">
          <IonIcon icon={add} />
          <IonLabel>Ajouter</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Home;

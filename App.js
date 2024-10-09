import {View, Text, Button, LogBox} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/home/Home';
import CustomTabBar from './src/tabBar/CustomTabBar';
import CustomDrawer from './src/drawer/customDrawer';
import JobList from './src/jobs/JobList';
import EmployerList from './src/employers/EmployerList';
import Preloader from './src/preloader/Preloader';
import Login from './src/auth/Login';
import Signup from './src/auth/Signup';
import ForgotPassword from './src/auth/ForgotPassword';
import JobDetail from './src/jobs/JobDetail';
import JobListing from './src/jobs/JobList';
import EmployerListing from './src/employers/EmployerList';
import FreelancersList from './src/freelancers/FreelancersList';
import FreelancerDetail from './src/freelancers/FreelancerDetail';
import EmployerDetail from './src/employers/EmployerDetail';
import ServicesList from './src/services/ServicesList';
import ServiceDetail from './src/services/ServiceDetail';
import PricePlan from './src/pricePlan/PricePlan';
import SavedItem from './src/savedItem/SavedItem';
import IdentityVerification from './src/identityVerification/IdentityVerification';
import PostQoute from './src/manageServices/PostQoute';
import PostService from './src/manageServices/PostService';
import ProfileSetting from './src/profileSetting/ProfileSetting';
import PayoutSettings from './src/payout/PayoutSettings';
import AccountSettings from './src/settings/AccountSettings';
import AddPortfolios from './src/managePortfolios/AddPortfolios';
import PortfoliosLisiting from './src/managePortfolios/PortfoliosLisiting';
import ManageProjects from './src/manageProjects/ManageProjects';
import ManageServices from './src/manageServices/ManageServices';
import InvoiceList from './src/invoices/InvoiceList';
import Dashboard from './src/dashboard/Dashboard';
import ManageJobs from './src/manageJobs/ManageJobs';
import ManageProposals from './src/manageJobs/ManageProposals';
import HelpAndSupport from './src/helpAndSupport/HelpAndSupport';
import ViewHistory from './src/manageJobs/ViewHistory';
import BlogListing from './src/home/BlogListing';
import BlogDetail from './src/home/BlogDetail';
import Dispute from './src/disputes/Dispute';
import store from './src/redux/Store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider, useSelector, useDispatch} from 'react-redux';
import PortfolioDetail from './src/managePortfolios/PortfolioDetail';
import SendProposal from './src/jobs/SendProposal';
import Checkout from './src/checkout/Checkout';
import ManageMilestone from './src/manageJobs/ManageMilestone';
import Inbox from './src/chat/Inbox';
import MessageDetail from './src/chat/MessageDetail';
import ImagePreview from './src/chat/ImagePreview';
import Translation from './src/constants/Translation';
import NoInternet from './src/noInternet/NoInternet';
import SubmitProposal from './src/home/SubmitProposal';

LogBox.ignoreAllLogs();
const Tab = createBottomTabNavigator();
let persistor = persistStore(store);

HomeTab = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="JobList" component={JobList} />
      <Tab.Screen name="ServiceList" component={ServicesList} />
      <Tab.Screen name="EmployerList" component={EmployerList} />
      <Tab.Screen name="ProfileSetting" component={ProfileSetting} />
    </Tab.Navigator>
  );
};

const Drawer = createDrawerNavigator();
HomeDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="DashboardTab" component={HomeTab} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="PricePlan" component={PricePlan} />
      <Drawer.Screen
        name="IdentityVerification"
        component={IdentityVerification}
      />
      <Drawer.Screen name="SavedItem" component={SavedItem} />
      <Drawer.Screen name="PostQoute" component={PostQoute} />
      <Drawer.Screen name="PostService" component={PostService} />
      <Drawer.Screen name="PayoutSettings" component={PayoutSettings} />
      <Drawer.Screen name="AddPortfolios" component={AddPortfolios} />
      <Drawer.Screen name="PortfoliosLisiting" component={PortfoliosLisiting} />
      <Drawer.Screen name="AccountSettings" component={AccountSettings} />
      <Drawer.Screen name="ManageProjects" component={ManageProjects} />
      <Drawer.Screen name="ManageServices" component={ManageServices} />
      <Drawer.Screen name="ManageJobs" component={ManageJobs} />
      <Drawer.Screen name="InvoiceList" component={InvoiceList} />
      <Drawer.Screen name="Inbox" component={Inbox} />
      <Drawer.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Drawer.Screen name="Dispute" component={Dispute} />
      <Tab.Screen name="EditProfile" component={ProfileSetting} />
    </Drawer.Navigator>
  );
};

const Stack = createNativeStackNavigator();
HomeStack = () => {
  // const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    Translation.setLanguage('en');
    // setTimeout(() => {
    //   setShowSplash(false);
    // }, 2000);
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <>
        <Stack.Screen name="preloader" component={Preloader} />
        <Stack.Screen name="StackHome" component={HomeDrawer} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="JobDetail" component={JobDetail} />
        <Stack.Screen name="FreelancerDetail" component={FreelancerDetail} />
        <Stack.Screen name="FreelancersList" component={FreelancersList} />
        <Stack.Screen name="ServicesList" component={ServicesList} />
        <Stack.Screen name="JobListing" component={JobListing} />
        <Stack.Screen name="EmployerListing" component={EmployerListing} />
        <Stack.Screen name="EmployerDetail" component={EmployerDetail} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
        <Stack.Screen name="PayoutSettings" component={PayoutSettings} />
        <Stack.Screen name="ManageProposals" component={ManageProposals} />
        <Stack.Screen name="ViewHistory" component={ViewHistory} />
        <Stack.Screen name="ManageMilestone" component={ManageMilestone} />
        <Stack.Screen name="PortfolioDetail" component={PortfolioDetail} />
        <Stack.Screen name="SendProposal" component={SendProposal} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="NoInternet" component={NoInternet} />
        <Stack.Screen name="MessageDetail" component={MessageDetail} />
        <Stack.Screen name="ImagePreview" component={ImagePreview} />
        <Stack.Screen name="BlogListing" component={BlogListing} />
        <Stack.Screen name="BlogDetail" component={BlogDetail} />
        <Stack.Screen name="SubmitProposal" component={SubmitProposal} />
      </>
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>{HomeStack()}</NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;

import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount } from 'enzyme';

import NavBar from '../components/navBar/NavBar';
// import MainPage from '../components/mainPage/MainPage';
import RandomFood from '../components/randomFood/RandomFood';
import RandomFoodMapView from '../components/randomFoodMapView/RandomFoodMapView';
import Favourites from '../components/favourites/Favourites';
import Settings from '../components/settings/Settings';
import Contact from '../components/contact/Contact';
import RestaurantDetails from '../components/restaurantDetails/RestaurantDetails';

import FloatingActionButton from '../components/floatingActionButton/FloatingActionButton';
import Snackbar from '../components/snackBar/SnackBar';
import DisplayResult from '../components/displayResult/DisplayResult';
import CardView from '../components/cardView/CardView';
import CustomMapList from '../components/customMap/CustomMapList';
import MyStoreCheckout from '../components/myStoreCheckout/MyStoreCheckout';
import ReactTable from '../components/reactTable/ReactTable';
import ImageSlider from '../components/imageSlider/ImageSlider';
import CustomMap from '../components/customMap/CustomMap';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
    i18n: (key: any) => key,
  }),
}));

describe('main.test', () => {
  describe('render test', () => {
    it('NavBar', () => {
      const wrapper = shallow(<NavBar />);
      expect(wrapper).toMatchSnapshot();
    });

    // it('MainPage', () => {
    //   const wrapper = shallow(<MainPage />);
    //   expect(wrapper).toMatchSnapshot();
    // });

    it('RandomFood', () => {
      const wrapper = shallow(<RandomFood />);
      expect(wrapper).toMatchSnapshot();
    });

    it('RandomFoodMapView', () => {
      const wrapper = shallow(<RandomFoodMapView />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Favourites', () => {
      const wrapper = shallow(<Favourites />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Settings', () => {
      const wrapper = shallow(<Settings />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Contact', () => {
      const wrapper = shallow(<Contact />);
      expect(wrapper).toMatchSnapshot();
    });

    it('RestaurantDetails', () => {
      const wrapper = shallow(<RestaurantDetails />);
      expect(wrapper).toMatchSnapshot();
    });

    it('FloatingActionButton', () => {
      const wrapper = shallow(<FloatingActionButton />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Snackbar', () => {
      const wrapper = shallow(<Snackbar />);
      expect(wrapper).toMatchSnapshot();
    });

    it('DisplayResult', () => {
      const wrapper = shallow(<DisplayResult />);
      expect(wrapper).toMatchSnapshot();
    });

    it('CardView', () => {
      const wrapper = shallow(<CardView />);
      expect(wrapper).toMatchSnapshot();
    });

    it('CustomMapList', () => {
      const wrapper = shallow(<CustomMapList />);
      expect(wrapper).toMatchSnapshot();
    });

    it('MyStoreCheckout', () => {
      const wrapper = shallow(<MyStoreCheckout />);
      expect(wrapper).toMatchSnapshot();
    });

    it('ReactTable', () => {
      const wrapper = shallow(<ReactTable />);
      expect(wrapper).toMatchSnapshot();
    });

    it('ImageSlider', () => {
      const wrapper = shallow(<ImageSlider />);
      expect(wrapper).toMatchSnapshot();
    });

    it('CustomMap', () => {
      const wrapper = shallow(<CustomMap />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});

import React from 'react';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";

import NavBar from '../components/navBar/NavBar';
import MainPage from '../components/mainPage/MainPage';
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
    t: key => key,
    i18n: key => key
  })
}));

describe("main.test", () => {
  describe("render test", () => {
    it("NavBar", () => {
      shallow(<NavBar />);
    });

    it("MainPage", () => {
      shallow(<MainPage />);
    });

    it("RandomFood", () => {
      shallow(<RandomFood />);
    });

    it("RandomFoodMapView", () => {
      shallow(<RandomFoodMapView />);
    });

    it("Favourites", () => {
      shallow(<Favourites />);
    });

    it("Settings", () => {
      shallow(<Settings />);
    });

    it("Contact", () => {
      shallow(<Contact />);
    });

    it("RestaurantDetails", () => {
      shallow(<RestaurantDetails />);
    });

    it("FloatingActionButton", () => {
      shallow(<FloatingActionButton />);
    });

    it("Snackbar", () => {
      shallow(<Snackbar />);
    });

    it("DisplayResult", () => {
      shallow(<DisplayResult />);
    });

    it("CardView", () => {
      shallow(<CardView />);
    });

    it("CustomMapList", () => {
      shallow(<CustomMapList />);
    });

    it("MyStoreCheckout", () => {
      shallow(<MyStoreCheckout />);
    });

    it("ReactTable", () => {
      shallow(<ReactTable />);
    });

    it("ImageSlider", () => {
      shallow(<ImageSlider />);
    });

    it("CustomMap", () => {
      shallow(<CustomMap />);
    });
  });
});

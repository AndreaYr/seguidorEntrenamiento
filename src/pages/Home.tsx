import Hero from '../components/Hero';
import Header from '../components/Header';
import HomeCard from '../components/HomeCard';
import HomeIA from '../components/HomeIA';
import HomeCalendar from '../components/HomeCalendar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <HomeCard />
      <HomeIA />
      <HomeCalendar />
      <Footer />
    </div>
  );
};

export default Home;
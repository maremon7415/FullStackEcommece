import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import Newsletter from "../components/NewsLatter";
import OurPolicy from "../components/OurPolicy";

function Home() {
  return (
    <div className="pageW">
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <Newsletter />
    </div>
  );
}

export default Home;

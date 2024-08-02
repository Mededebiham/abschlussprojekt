import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const posts = [
  {
    title: 'Privatkredit',
    text: 'Profitieren Sie von unseren attraktiven Konditionen und flexiblen Laufzeiten. Unser Privatkredit bietet Ihnen die Flexibilität, die Sie benötigen, um Ihre persönlichen Projekte zu verwirklichen. Egal ob Autokauf, Renovierung oder eine Traumreise – mit unseren maßgeschneiderten Kreditlösungen sind Sie immer gut beraten.',
    link: '/privatkredit',
    image: 'https://cdn.pixabay.com/photo/2020/04/06/04/04/drone-5008211_1280.jpg',
  },
  {
    title: 'Für dich am Start',
    text: 'Wir unterstützen dich bei deinem nächsten großen Schritt. Ob es um den Start in die Selbstständigkeit, eine berufliche Weiterbildung oder den Kauf der ersten eigenen Wohnung geht – wir sind an deiner Seite und helfen dir, deine Ziele zu erreichen. Mit unserem umfangreichen Serviceangebot steht deinem Erfolg nichts mehr im Weg.',
    link: '/fuer-dich-am-start',
    image: 'https://cdn.pixabay.com/photo/2015/09/02/12/30/hiker-918473_1280.jpg',
  },
  {
    title: 'Sparen und Gewinnen',
    text: 'Sparen und gleichzeitig die Chance auf tolle Gewinne nutzen. Mit PS Sparen und Gewinnen kombinieren Sie die Vorteile eines sicheren Sparplans mit der Möglichkeit, attraktive Preise zu gewinnen. Jede Einzahlung erhöht Ihre Gewinnchancen und bringt Sie Ihren Sparzielen näher.',
    link: '/ps-sparen-und-gewinn',
    image: 'https://cdn.pixabay.com/photo/2016/07/11/20/19/piggy-bank-1510525_1280.jpg',
  },
  {
    title: 'Mastercard Gold',
    text: 'Genießen Sie exklusive Vorteile und weltweite Akzeptanz. Die Mastercard Gold bietet Ihnen nicht nur hohe Sicherheitsstandards und flexible Einsatzmöglichkeiten, sondern auch zahlreiche Zusatzleistungen wie Reiseversicherungen und Bonusprogramme. Erleben Sie grenzenlose Freiheit mit der Mastercard Gold.',
    link: '/mastercard-gold',
    image: 'https://img.freepik.com/vektoren-kostenlos/realistisches-kreditkartendesign_23-2149125388.jpg?t=st=1721222506~exp=1721226106~hmac=344b80d6623f682dc70bbc4c258da370b91736a206d41df20c35e5c9604010e2&w=826',
  },
  {
    title: 'Gemeinsam Nachhaltig Stark',
    text: 'Setzen Sie auf nachhaltige Investitionen für eine bessere Zukunft. Mit unseren nachhaltigen Investmentmöglichkeiten tragen Sie aktiv zum Umweltschutz bei und profitieren gleichzeitig von soliden Renditen. Gemeinsam können wir die Welt ein Stück besser machen – investieren Sie in Nachhaltigkeit.',
    link: '/gemeinsam-nachhaltig-stark',
    image: 'https://img.freepik.com/vektoren-kostenlos/menschen-mit-oekologischem-nachhaltigkeitskonzept_53876-66157.jpg?t=st=1721222444~exp=1721226044~hmac=74c7cf14bf83227b069a275df73a1465dec35d3323c78e70e06d93f209b6fdc2&w=996',
  },
  {
    title: 'Rechnung hochladen, überweisen, check ✅',
    text: 'Mit unserer neuen Fotoüberwiesung können Sie blitzschnell Ihre Rechnungen begleichen. Wir extrahieren aus dem von Ihnen hochgeladenen Foto den Empfängernamen, die IBAN und den Betrag der Rechnung. So können Sie sich schnell wieder den wichtigen Dingen im Leben widmen.',
    link: '/gemeinsam-nachhaltig-stark',
    image: 'https://cdn.pixabay.com/photo/2017/08/09/10/49/shopping-2614150_1280.jpg',
  },

  {
    title: 'Willkommen in unserer digitalen Bankfiliale!',
    text: 'Vielen Dank für den Besuch unserer Website. Wenn Sie eine Überwiesung tätigen, ihre Finanzen verwalten oder eine Auswertung zu Ihren Finanzen erhalten wollen, dann sind Sie hier genau richtig!',
    link: '/gemeinsam-nachhaltig-stark',
    image: '/Digital-Bank-Logo.png',
  },
];

const Home = () => {
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);

  const handleReadMore = (index: number) => {
    if (expandedPosts.includes(index)) {
      setExpandedPosts(expandedPosts.filter((i) => i !== index));
    } else {
      setExpandedPosts([...expandedPosts, index]);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '0px',
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  return (
      <div className="relative w-screen  w-full max-w-screen-xl px-6 mx-auto flex bg-red-500  m-5">
        <div className="w-full max-w-screen-xl px-6 mx-auto">
          <Slider {...settings} className="w-full max-w-screen-xl px-6 mx-auto mt-5">
            {posts.map((post, index) => (
                <div key={index} className="p-4">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-screen-lg mx-auto">
                    <div
                        className="relative w-full h-96 bg-cover bg-center bg-no-repeat rounded-lg"
                        style={{
                          backgroundImage: `url(${post.image})`,
                          minHeight: 'calc(100vh - 12rem)',
                        }}
                    >
                      <div className="bg-white bg-opacity-75 p-6 rounded-lg absolute bottom-0 w-full">
                        <h3 className="text-2xl font-bold text-black">{post.title}</h3>
                        <p className="mt-2 text-black">
                          {expandedPosts.includes(index)
                              ? post.text
                              : `${post.text.substring(0, 100)}...`}
                        </p>
                        <button
                            onClick={() => handleReadMore(index)}
                            className="mt-4 inline-block text-black-500 hover:underline"
                        >
                          {expandedPosts.includes(index) ? 'Weniger anzeigen' : 'Weiterlesen'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </Slider>
        </div>
      </div>
  );
};

export default Home;

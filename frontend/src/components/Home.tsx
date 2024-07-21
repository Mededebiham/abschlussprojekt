import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const posts = [
  {
    title: 'Privatkredit',
    text: 'Profitieren Sie von unseren attraktiven Konditionen und flexiblen Laufzeiten. Unser Privatkredit bietet Ihnen die Flexibilität, die Sie benötigen, um Ihre persönlichen Projekte zu verwirklichen. Egal ob Autokauf, Renovierung oder eine Traumreise – mit unseren maßgeschneiderten Kreditlösungen sind Sie immer gut beraten.',
    link: '/privatkredit',
    image: 'https://img.freepik.com/fotos-kostenlos/schluessel-mit-hausfiguerchen-und-papieren_23-2147737976.jpg?t=st=1721222182~exp=1721225782~hmac=2e783398a2cd9084fcedc946ded7c0d7cf847f9aa799bc19223ea10ef9786435&w=1380',
  },
  {
    title: 'Für dich am Start',
    text: 'Wir unterstützen dich bei deinem nächsten großen Schritt. Ob es um den Start in die Selbstständigkeit, eine berufliche Weiterbildung oder den Kauf der ersten eigenen Wohnung geht – wir sind an deiner Seite und helfen dir, deine Ziele zu erreichen. Mit unserem umfangreichen Serviceangebot steht deinem Erfolg nichts mehr im Weg.',
    link: '/fuer-dich-am-start',
    image: 'https://img.freepik.com/vektoren-kostenlos/ein-mann-hebt-geld-vom-geldautomaten-ab-und-seine-frau-cartoon-chara_1308-109770.jpg?t=st=1721222314~exp=1721225914~hmac=757a1d6a5d152c91b7ebbb55c5fffc31aa5a4d258dddfdbfc133a2b1d9246536&w=740',
  },
  {
    title: 'PS Sparen und Gewinn',
    text: 'Sparen und gleichzeitig die Chance auf tolle Gewinne nutzen. Mit PS Sparen und Gewinnen kombinieren Sie die Vorteile eines sicheren Sparplans mit der Möglichkeit, attraktive Preise zu gewinnen. Jede Einzahlung erhöht Ihre Gewinnchancen und bringt Sie Ihren Sparzielen näher.',
    link: '/ps-sparen-und-gewinn',
    image: 'https://img.freepik.com/fotos-kostenlos/anordnung-von-sparschwein-und-geschenkboxen_23-2148669976.jpg?t=st=1721222596~exp=1721226196~hmac=8e4d7d99c9a8844d4bfef0527af173f0cfa2406f47082260e9aca73daa95dedd&w=1380',
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
      <div className="relative w-screen  w-full max-w-screen-xl px-6 mx-auto flex bg-red-500">
        <div className="w-full max-w-screen-xl px-6 mx-auto">
          <Slider {...settings} className="w-full max-w-screen-xl px-6 mx-auto">
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

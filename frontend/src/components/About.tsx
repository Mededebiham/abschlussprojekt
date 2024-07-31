import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { User } from '../store/types';

const profiles = [
  {
    id: 1,
    name: 'Medede Biham Tchala',
    description: 'Hallo. Ich bin Medede einer der drei Entwickler, die an der Erstellung der Plattform zu' +
        ' simulieren eines Online-Banking gearbeitet haben. Mit einem starken Fokus auf die Entwicklung' +
        ' robuster, skalierbarer und sicherer Backend-Lösungen trage ich dazu bei, dass unsere Anwendungen' +
        ' reibungslos und effizient funktionieren. Meine Leidenschaft für Technologie und Problemlösung treibt ' +
        'mich an, kontinuierlich neue Fähigkeiten zu erlernen und innovative Lösungen zu entwickeln.',
    imageUrl: 'https://avatars.githubusercontent.com/u/58220778?s=400&u=18740b212bddba2dcd37cedf41589e7d30b2da9e&v=4',
  },
  {
    id: 2,
    name: 'Tillmann Leiner',
    description: 'Hallo. Ich bin Tillmann einer der glorreichen Vier, die an diesem tollen Projekt gearbeitet haben.' +
        'Für Verbesserungsvorschläge und Fehlermeldungen bin ich immer gerne zu haben.',
    imageUrl: 'https://avatars.githubusercontent.com/u/96163637?s=400&u=23367306c1fb98dabed974437941f821f534034b&v=4',
  },
  {
    id: 3,
    name: 'Yasin Ekinci',
    description: 'Bitte hier eine Beschreibung zu dir und eventuell',
    imageUrl: 'https://avatars.githubusercontent.com/u/76652837?v=4',
  },
  {
    id: 4,
    name: 'Mats Engbers',
    description: 'Bitte hier eine Beschreibung zu dir und eventuell ein Bild von dir hochladen 4',
    imageUrl: 'https://media.licdn.com/dms/image/D4D03AQEWwWUNOmv8Gw/profile-displayphoto-shrink_800_800/0/1674298551686?e=1727913600&v=beta&t=KZAbxGnTGDO00iyPU5c715a0h3JKHSwvPKA6AFLzANI',
  },
];

const About: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || '{}');

    setIsLoggedIn(loggedIn);
    setUser(userData);
  }, []);

  return (
      <div className="h-screen flex flex-col items-center">
        {isLoggedIn ? (
            <h2 className="text-black text-center ml-20 mt-20">You are logged in! {user?.firstName}</h2>
        ) : (
            <h2 className="text-black text-center ml-20 mt-20">You are not logged in.</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 px-4 lg:px-20">
          {profiles.map((profile) => (
              <div key={profile.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="w-40 h-40 flex justify-center items-center overflow-hidden rounded-full mb-4">
                  <img src={profile.imageUrl} alt={profile.name} className="h-full w-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{profile.name}</h3>
                <p className="text-gray-600 text-center whitespace-pre-line">{profile.description}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default About;

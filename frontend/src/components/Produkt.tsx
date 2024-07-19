import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Produkt: React.FC = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(Cookies.get('user') || '{}');

    useEffect(() => {
        if (userData?.confirmedByAdmin === false) {
            navigate('/Unconfirmed'); // Redirect to an unconfirmed user page
        } else {
            console.log("do sth else");
        }
    }, []);

    const posts = [
        {
            title: "Sparkasse Girokonto",
            description: "Das Girokonto der Sparkasse bietet Ihnen eine einfache und sichere Möglichkeit, Ihre täglichen Bankgeschäfte zu erledigen.",
            benefits: ["Kostenlose Kontoführung bei Gehaltseingang", "Online-Banking und Mobile-Banking App", "Kreditkarte auf Wunsch"],
            url: "https://www.sparkasse.de/pk/produkte/konten-und-karten/girokonto.html"
        },
        {
            title: "Sparkasse Kreditkarte",
            description: "Mit der Sparkasse Kreditkarte können Sie weltweit sicher und flexibel bezahlen.",
            benefits: ["Weltweit akzeptiert", "Inklusive Reiseversicherung", "Flexible Rückzahlungsmöglichkeiten"],
            url: "https://www.sparkasse.de/suche.html?query=kreditkarte"
        },
        {
            title: "Sparkasse Online-Banking",
            description: "Das Online-Banking der Sparkasse ermöglicht Ihnen, Ihre Bankgeschäfte bequem von zu Hause aus zu erledigen.",
            benefits: ["24/7 Zugriff auf Ihr Konto", "Sichere TAN-Verfahren", "Überweisungen und Daueraufträge online verwalten"],
            url: "https://www.sparkasse.de/suche.html?query=online+Banking"
        },
        {
            title: "Sparkasse Sparplan",
            description: "Mit dem Sparkasse Sparplan können Sie regelmäßig kleine Beträge sparen und von attraktiven Zinsen profitieren.",
            benefits: ["Flexible Sparraten", "Hohe Sicherheit", "Attraktive Zinsen"],
            url: "https://www.sparkasse.de/suche.html?query=sparkasse+sparplan"
        },
        {
            title: "Sparkasse Baufinanzierung",
            description: "Die Baufinanzierung der Sparkasse unterstützt Sie bei der Verwirklichung Ihres Traums vom Eigenheim.",
            benefits: ["Individuelle Beratung", "Attraktive Zinssätze", "Flexible Laufzeiten und Tilgungsmöglichkeiten"],
            url: "https://www.sparkasse.de/suche.html?query=baufinanzierung"
        },
        {
            title: "Sparkasse Altersvorsorge",
            description: "Planen Sie Ihre Zukunft mit den Altersvorsorge-Produkten der Sparkasse und genießen Sie finanzielle Sicherheit im Ruhestand.",
            benefits: ["Individuelle Beratung", "Staatliche Förderungen nutzen", "Attraktive Renditen"],
            url: "https://www.sparkasse.de/suche.html?query=altersvorsorge"
        },
        {
            title: "Sparkasse Privatkredit",
            description: "Der Privatkredit der Sparkasse hilft Ihnen, Ihre Wünsche und Pläne zu verwirklichen – schnell und unkompliziert.",
            benefits: ["Flexible Laufzeiten", "Feste Zinssätze", "Schnelle Auszahlung"],
            url: "https://www.sparkasse.de/suche.html?query=privatkredit"
        },
        {
            title: "Sparkasse Versicherungen",
            description: "Sichern Sie sich und Ihre Familie mit den umfassenden Versicherungsangeboten der Sparkasse ab.",
            benefits: ["Individuelle Beratung", "Umfangreicher Versicherungsschutz", "Attraktive Konditionen"],
            url: "https://www.sparkasse.de/suche.html?query=versicherung"
        },
        {
            title: "Sparkasse Depot",
            description: "Mit dem Sparkasse Depot investieren Sie in Wertpapiere und profitieren von den Chancen an den Finanzmärkten.",
            benefits: ["Professionelle Beratung", "Online-Depotführung", "Breite Auswahl an Anlageprodukten"],
            url: "https://www.sparkasse.de/suche.html?query=Sparkasse+Depot"
        },
        {
            title: "Sparkasse Geschäftskonto",
            description: "Das Geschäftskonto der Sparkasse bietet Unternehmern und Selbstständigen maßgeschneiderte Lösungen für ihre Bankgeschäfte.",
            benefits: ["Individuelle Kontomodelle", "Online- und Mobile-Banking", "Attraktive Konditionen"],
            url: "https://www.sparkasse.de/suche.html?query=Gesch%C3%A4ftskonto"
        },
        {
            title: "Sparkasse Immobilienfinanzierung",
            description: "Die Sparkasse Immobilienfinanzierung unterstützt Sie bei der Finanzierung Ihrer Traumimmobilie.",
            benefits: ["Individuelle Beratung", "Attraktive Zinssätze", "Flexible Laufzeiten und Tilgungsmöglichkeiten"],
            url: "https://www.sparkasse.de/suche.html?query=Immobilienfinanzierung"
        },
        {
            title: "Sparkasse Ausbildungsfinanzierung",
            description: "Mit der Ausbildungsfinanzierung der Sparkasse können Sie Ihre Ausbildung oder die Ihrer Kinder finanzieren.",
            benefits: ["Flexible Kreditbeträge", "Attraktive Zinssätze", "Einfache Rückzahlung"],
            url: "https://www.sparkasse.de/suche.html?query=Ausbildungsfinanzierung"
        },
        {
            title: "Sparkasse Umweltkredit",
            description: "Der Umweltkredit der Sparkasse unterstützt umweltfreundliche Projekte und Investitionen.",
            benefits: ["Attraktive Zinssätze", "Förderung von Nachhaltigkeit", "Flexible Laufzeiten"],
            url: "https://www.sparkasse.de/suche.html?query=Umweltkredit"
        },
        {
            title: "Sparkasse Tagesgeldkonto",
            description: "Das Tagesgeldkonto der Sparkasse bietet Ihnen flexible und sichere Möglichkeiten zum Sparen.",
            benefits: ["Tägliche Verfügbarkeit", "Attraktive Zinsen", "Keine Kontoführungsgebühren"],
            url: "https://www.sparkasse.de/suche.html?query=Tagesgeldkonto"
        },
        {
            title: "Sparkasse Finanzierung für Selbstständige",
            description: "Die Sparkasse bietet spezielle Finanzierungsprodukte für Selbstständige und Freiberufler an.",
            benefits: ["Individuelle Beratung", "Flexible Kreditlösungen", "Attraktive Konditionen"],
            url: "https://www.sparkasse.de/suche.html?query=Finanzierung+f%C3%BCr+Selbstst%C3%A4ndige"
        }
    ];

    return (
        <div className="h-screen flex flex-col items-center">
            <h2 className="text-white font-bold text-center ml-20 mt-20">Produkt!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 mx-20">
                {posts.map((post, index) => (
                    <div key={index} className="bg-gray-800 p-5 mb-5 rounded">
                        <h3 className="text-white font-bold text-lg">{post.title}</h3>
                        <p className="text-white mt-2">{post.description}</p>
                        <ul className="text-white mt-2">
                            {post.benefits.map((benefit, idx) => (
                                <li key={idx}>- {benefit}</li>
                            ))}
                        </ul>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Mehr erfahren
                            </button>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Produkt;

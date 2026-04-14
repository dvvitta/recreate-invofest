import Header from "./components/Header";
import Button from "./components/ui/Button";
import CardPembicara from "./components/ui/CardPembicara";
import Collapse from "./components/ui/Collapse";
import Card  from "./components/ui/Card";

interface Pembicara {
  nama: string;
  role: string;
  imageUrl: string;
}

function App() {
  const pembicara: Pembicara[] = [
    {
      nama: "Dery Agung Triyadi",
      role: "AWS Indonesia",
      imageUrl:
        "https://www.invofest-harkatnegeri.com/assets/seminar/Seminar%20Dery.png",
    },
    {
      nama: "Sowam Habibi",
      role: "Google Indonesia",
      imageUrl:
        "https://www.invofest-harkatnegeri.com/assets/seminar/seminar%20sowam.png",
    },
    {
      nama: "Lhuqita Fazry",
      role: "Mobile Development Developer, Founder Rumah Coding Indonesia",
      imageUrl:
        "https://www.invofest-harkatnegeri.com/assets/workshop/workshop%20mobile.png",
    },
  ];

  const collapseItems = [
    {
      title: "Apa itu Invofest?",
      description:
        "Invofest (Informatics Vocational Festival) adalah festival tahunan yang bertujuan untuk menginspirasi dan memberdayakan generasi muda Indonesia dalam menghadapi era digital.",
    },
    {
      title: "Kapan dan di mana Infovest akan diselenggarakan?",
      description:
        "Invofest akan diselenggarakan pada tanggal 28-29 September 2025 di Universitas Harkat Negeri, Tegal.",
    },
    {
      title: "Siapa saja yang dapat mengikuti Infovest?",
      description:
        "Invofest terbuka untuk umum, terutama bagi pelajar dan mahasiswa yang tertarik dengan dunia teknologi.",
    },
  ];

  const cardItems = [
    {
      title: "IT Seminar",
      description:
        "Seminar nasional ini membahas “Human-AI Integration: Merancang Arsitektur Kolaboratif, Bukan Kompetitif” untuk mengembangkan potensi diri dan pengetahuan teknologi lebih dalam lagi.",
    },
    {
      title: "IT Talkshow",
      description:
        "Talkshow “Humanizing Technology: Kolaborasi Manusia dan AI di Masa Depan” membahas peran manusia dalam memanfaatkan AI untuk solusi berkelanjutan dan peningkatan teknologi.",
    },
    {
      title: "IT Competition",
      description:
        "Kompetisi “From Creation to Innovation” mengajak generasi muda untuk mengembangkan inovasi dan kreativitas guna membentuk kelompok yang memiliki potensi luar biasa, yang mampu mewujudkan masa depan yang berkelanjutan.",
    },
    {
      title: "IT Workshop",
      description:
        "Workshop 'AI for a Sustainable Future: The Role of Z Generation in the Digital Era' membekali Gen Z dengan keterampilan praktis AI untuk menciptakan solusi berkelanjutan.",
    },
  ];


  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <section
          id="hero"
          className="py-10 flex gap-10 justify-between items-center"
        >
          <div className="w-2/3 flex flex-col gap-6">
            <img
              src="https://www.invofest-harkatnegeri.com/assets/text-image.png"
              alt=""
              className="w-96"
            />

            <p>
              Invofest (Informatics Vocational Festival) adalah festival tahunan
              yang bertujuan untuk menginspirasi dan memberdayakan generasi muda
              Indonesia dalam menghadapi era digital. Dengan mengusung tema
              “Beyond Limits, Beyond Intelligence: Innovate for a Smarter
              Tomorrow ”.
            </p>

            <div className="flex gap-3">
              <Button label="Info Selengkapnya" variant="primary" />
              <Button label="Hubungi Panitia" variant="outline" />
            </div>
          </div>

          <div className="w-1/3">
            <img
              src="https://www.invofest-harkatnegeri.com/assets/Maskot-Hero.png"
              alt=""
            />
          </div>
        </section>

        <section id="pembicara" className="py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-3">
            {pembicara.map((item, index) => (
              <CardPembicara
                key={index}
                nama={item.nama}
                role={item.role}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </section>

        <section
          id="cards"
          className="py-24 grid grid-cols-1 md:grid-cols-2 gap-10 px-3"
        >
          {cardItems.map((item, index) => (
            <Card key={index} className="w-full">
              <h3 className="text-2xl text-red-900 mb-4">{item.title}</h3>
              <p>{item.description}</p>
              <Button
                label="Info Selengkapnya"
                variant="primary"
                className="mt-4"
              />
            </Card>
          ))}
        </section>

        <section className="py-24 flex flex-col gap-2 px-3">
          {collapseItems.map((item, index) => (
            <Collapse
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </section>
      </div>
    </>
  );
}

export default App;

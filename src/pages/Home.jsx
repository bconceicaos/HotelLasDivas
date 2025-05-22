//Home.jsx
import { useState, useEffect } from 'react'; // Importa useState y useEffect
import '../assets/styles/main.css';
import { Button } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import entradaImage from '../assets/img/entrada.jpg'; // Importa la imagen 'entrada.jpg'
import rellanoImage from '../assets/img/rellano.jpg'; // Importa la imagen 'rellano.jpg'
import recepcionImage from '../assets/img/recepcion.jpg'; // Importa la imagen 'recepcion.jpg'

function Home() {
    // Define un array con las rutas de las imágenes
    const images = [entradaImage, rellanoImage, recepcionImage];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Función para avanzar al siguiente índice de imagen
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Efecto para cambiar de imagen automáticamente
    useEffect(() => {
        const interval = setInterval(nextImage, 3000); // Cambia de imagen cada 3 segundos
        return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cardData = [
        {
          title: "Ubicación excepcional",
          description: "Estratégicamente situado en un entorno espectacular que combina la tranquilidad de la naturaleza con la conveniencia de estar cerca de atracciones turísticas y del centro de la ciudad.",
          link: "./contacto"
        },
        {
          title: "Diseño de vanguardia",
          description: "Nuestras instalaciones reflejan un diseño innovador y contemporáneo que combina elegancia y estilo, creando un ambiente sofisticado que te dejará sin aliento.",
          link: "./servicios"
        },
        {
          title: "Atención personalizada",
          description: "Nuestro compromiso con la atención al cliente es insuperable. Cada huésped es tratado como una 'Diva', con un servicio personalizado que supera todas las expectativas.",
          link: "./contacto"
        },
        {
          title: "Experiencias únicas",
          description: "Ofrecemos una gama de experiencias excepcionales, desde tratamientos de spa de clase mundial hasta cenas gourmet en nuestro restaurante con estrella Michelin.",
          link: "./servicios"
        },
        {
          title: "Habitaciones de ensueño",
          description: "Nuestras habitaciones y suites son un oasis de confort y estilo, con comodidades de primera clase y vistas panorámicas impresionantes.",
          link: "./reservas"
        },
        {
          title: "Compromiso con la sostenibilidad",
          description: "En 'Las Divas', no solo cuidamos de nuestros huéspedes, sino también del planeta. Nuestro enfoque en la sostenibilidad se refleja en todas las áreas del hotel.",
          link: "./servicios"
        }
      ];      

    return (
        <div className="container">
          <div className="slider-container">
            {/* Carga la imagen */}
            <img src={images[currentImageIndex]} alt="Imagen" className="slider-image" />
            <div className='row'>
              <div className="slider-text">
                  <h1 className="col-md">Bienvenidos a Las Divas</h1> 
                  <p className="col-md presentacion">
                      Inspirada en la creencia de que el arte cambia la forma en que miramos el mundo. Con habitaciones cómodas y modernistas y espacios de diseño que presentan una colección curada de arte de cerca y de lejos, Las Divas es un lugar para que tanto los lugareños como los visitantes colaboren, celebren y se sientan inspirados. Contamos con 8000 pies cuadrados de espacio para eventos único y una colección de destinos culinarios y experienciales que incluyen Fora, Selva, Sushi by Bou y Rooftop Cinema Club.
                      Encuéntranos en Las Divas.
                  </p>
              </div>
            </div>
          </div>
            
          <div className="mt-5 card-container">
            <h2 className="text-center mb-4">¿Por qué elegir Hotel Las Divas?</h2>
            <div className="row">
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={3000}
                    stopOnHover={false}
                    showArrows={false}
                    showIndicators={false}
                    centerMode={true}
                    centerSlidePercentage={100 / 3}
                    className="custom-carousel"
                >
                    {cardData.map((card, index) => (
                    <div key={index} className="card">
                        <div className="card-body">
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-text">{card.description}</p>
                            <Button variant="primary" href={card.link}>Ver más</Button>
                        </div>
                    </div>
                  ))}
                </Carousel>
              </div>
          </div>
        </div>
    )
}

export default Home;
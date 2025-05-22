import '../assets/styles/main.css';
import { Carousel, Row, Col } from 'react-bootstrap';

import restauranteImage from '../assets/img/restaurante.jpg'; // Importa la imagen 'restaurante.jpg'
import barImage from '../assets/img/bar.jpg'; // Importa la imagen 'bar.jpg'
import piscinaImage from '../assets/img/piscina.jpg'; // Importa la imagen 'piscina.jpg'
import saunaImage from '../assets/img/sauna.jpg'; // Importa la imagen 'sauna.jpg'
import bienestarImage from '../assets/img/bienestar.jpg'; // Importa la imagen 'bienestar.jpg'
import cocktailpdf from '../assets/menu_cocktails.pdf'; // Importa el pdf 'menu_cocktails.pdf'


function Servicios() {
    return (
        <div className="container">
            <Carousel className='carousel-container'>
                <Carousel.Item>
                    <Row className="restauracion">
                        <Col md={6}>
                            {/* Carga la imagen */}
                            <img src={restauranteImage} alt="Restaurante" className="imagen" />
                        </Col>
                        <Col md={6} className="texto">
                            <h1>Come & Bebe</h1>
                            <p>
                                Sumérgete en una experiencia gastronómica y de mixología digna de las más grandes divas de la historia en nuestro restaurante. 
                                Reconocido por sus platos regionales e internacionales preparados con ingredientes frescos y de alta calidad, nuestro equipo de 
                                expertos en cocina y coctelería te invita a disfrutar de una fusión única de sabores y estilos. Cada plato y cóctel es una oda 
                                a la elegancia, el glamour y el encanto eterno de las divas legendarias. Desde exquisitas creaciones culinarias hasta cócteles 
                                artesanales meticulosamente elaborados, en nuestro santuario gastronómico, cada bocado y sorbo es una celebración de la grandeza 
                                y el esplendor. ¡Déjate seducir por el refinado arte de la restauración y la coctelería en el Hotel Divino, donde cada experiencia 
                                es digna de un aplauso de pie!  
                                <br /><br />
                                - Desayuno buffet <br />
                                - Almuerzo a la carta <br />
                                - Cena de tres platos <br />
                                - Menú infantil <br />
                            </p>
                        </Col>
                    </Row>
                </Carousel.Item>
                <Carousel.Item>
                    <Row className="bar">
                        <Col md={8} className="texto">
                            <h1>Bar o Lounge</h1>
                            <p>
                                Sumérgete en una experiencia de mixología digna de las más grandes divas de la historia en nuestro bar. Reconocido por sus cócteles artesanales meticulosamente elaborados, nuestro equipo de expertos en coctelería te invita a disfrutar de sus famosos cócteles. Imagina saborear el exquisito cóctel "Beyoncé", una mezcla vibrante de licores selectos con un toque de frescura y sofisticación que encarna la fuerza y la sensualidad de la icónica artista. O quizás prefieras deleitarte con el cautivador sabor del "Barbra Streisand", una creación única que combina notas dulces y cítricas en una sinfonía de deleite para los sentidos.
                                <br />
                                Desde cócteles clásicos hasta creaciones innovadoras, en nuestro santuario de la mixología, cada sorbo es una celebración de la grandeza y el esplendor. ¡Déjate seducir por el refinado arte de la coctelería en el Bar Divino!
                            </p>
                            {/* Carga el pdf */}
                            <a href={cocktailpdf} download="menu_cocktails.pdf" className="btn btn-primary">Descargar PDF</a>
                        </Col>
                        <Col md={4}>
                            {/* Carga la imagen */}
                            <img src={barImage} alt="Bar" />
                        </Col>
                    </Row>
                </Carousel.Item>
                <Carousel.Item>
                    <Row className="piscina">
                        <Col md={4}>
                            {/* Carga la imagen */}
                            <img src={piscinaImage} alt="Piscina" className="imagenPiscina" />
                        </Col>
                        <Col md={8} className="texto">
                        <br /><br /><br />
                            <h1>Relax en la Piscina</h1>
                            <p>
                                Nuestra piscina te invita a relajarte y rejuvenecer mientras disfrutas de las vistas panorámicas. Ya sea que desees refrescarte con un chapuzón vigorizante o simplemente descansar junto a la piscina con una copa de champán, nuestra piscina es el lugar perfecto para disfrutar de momentos inolvidables.
                                <br /><br />
                                - Acceso a la piscina (para huéspedes no alojados)<br />
                                - Alquiler de cabañas o tumbonas premium<br />
                                - Servicio de bebidas y aperitivos junto a la piscina<br />
                                - Clases de natación o ejercicios acuáticos (si aplicable)
                            </p>
                        </Col>
                    </Row>
                </Carousel.Item>
                <Carousel.Item>
                    <Row className="bienestar">
                        <Col md={6} className="texto">
                            <h1>Bienestar</h1>
                            <p>
                                Adéntrate en un santuario de bienestar diseñado para mimar tu cuerpo, mente y espíritu. Deja que nuestros expertos terapeutas te guíen en un viaje de rejuvenecimiento con una amplia gama de tratamientos indulgentes, desde masajes revitalizantes hasta envolturas corporales exquisitas. Sumérgete en la calidez reconfortante de nuestro sauna y deja que las tensiones se disuelvan en el aire. En nuestro oasis de bienestar, cada momento está diseñado para renovar tus sentidos y nutrir tu alma, permitiéndote brillar con la verdadera esencia de una diva.
                                <br /><br />
                                - Masaje relajante de 60 minutos<br />
                                - Tratamientos faciales<br />
                                - Paquetes de spa (masaje, facial, baño de vapor, etc.)<br />
                                - Acceso al área de bienestar (sauna, baño de vapor, jacuzzi, etc.)<br />
                                -  Clases de yoga o meditación (si aplicable)<br />
                            </p>
                        </Col>
                        <Col md={3}>
                            {/* Carga la imagen */}
                            <img src={bienestarImage} alt="Bienestar" className="imagen" />
                        </Col>
                        <Col md={3}>
                            {/* Carga la imagen */}
                            <img src={saunaImage} alt="saunaImage" className="imagen" />
                        </Col>
                    </Row>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default Servicios;

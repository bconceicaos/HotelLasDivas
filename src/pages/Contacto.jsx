import '../assets/styles/main.css';

function Contacto() {
    return (
        <div className="container">
            <div className="d-flex justify-content-center pt-5">
                <h2 className="font-weight-bold">¡Póngase en contacto! </h2>
            </div>
            <div className="d-flex justify-content-center text-muted">Contáctenos para un presupuesto, ayuda o unirse al club</div>
            <div className="d-md-flex flex-md-row justify-content-center py-4">
                <div className="d-md-flex flex-md-column contact px-4">
                    <div className="d-md-flex justify-content-center icon py-2"> <span className="fa fa-map-marker"></span> <span className="mobile-info text-dark p-2 pb-3">123 Ocean Avenue Los Ángeles, CA 90001 Estados Unidos</span> </div>
                    <div className="contact-info">123 Ocean Avenue Los Ángeles, <br /> CA 90001 Estados Unidos</div>
                </div>
                <div className="d-flex flex-column contact px-4">
                    <div className="d-md-flex justify-content-center icon py-2"> <span className="fa fa-phone"></span> <span className="mobile-info text-dark p-2 pb-3">+1 (555) 123-4567</span> </div>
                    <div className="contact-info">+1 (555) 123-4567</div>
                </div>
                <div className="d-flex flex-column contact px-4">
                    <div className="d-md-flex justify-content-center icon py-2"> <span className="fa fa-envelope"></span> <span className="mobile-info text-dark p-2 pb-3">info@lasdivashotel.com</span> </div>
                    <div className="contact-info">info@lasdivashotel.com</div>
                </div>
            </div>
        </div>
    );
}

export default Contacto;


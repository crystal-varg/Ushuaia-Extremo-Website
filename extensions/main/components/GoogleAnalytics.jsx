import { useEffect } from "react";

const GoogleAnalytics = () => {
    useEffect(() => {
        // 1. Insertar el script de la librería (gtag.js)
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src =
            "https://www.googletagmanager.com/gtag/js?id=G-V3JQC725PD";
        document.head.appendChild(script1);

        // 2. Insertar el script de configuración
        const script2 = document.createElement("script");
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-V3JQC725PD');
    `;
        document.head.appendChild(script2);

        // Limpieza al desmontar el componente (opcional)
        return () => {
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, []);

    return null; // Este componente no renderiza nada visualmente
};

export default GoogleAnalytics;

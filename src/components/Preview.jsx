import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PreviewCertificate = () => {
  const { name } = useParams();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Convertir la imagen de Supabase a base64
  const getImageAsBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return base64;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Configuración del tamaño del canvas
    const width = 620;
    const height = 877;
    canvas.width = width;
    canvas.height = height;

    // URL de la imagen de Supabase
    const backgroundImageURL = 'https://qyfrfgcefvwpkqtzjjxi.supabase.co/storage/v1/object/public/bsf/CertificadoManosSolidarias.png?t=2024-12-10T16%3A41%3A13.686Z';

    const loadImage = async () => {
      const base64Image = await getImageAsBase64(backgroundImageURL);
      const background = new Image();
      background.src = base64Image;
      background.onload = () => {
        // Dibujar el fondo
        ctx.drawImage(background, 0, 0, width, height);

        // Configuración del texto
        ctx.font = '55px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';

        // Dibujar el nombre en mayúsculas
        const upperCaseName = name.toUpperCase();
        ctx.fillText(upperCaseName, width / 2, 560);
      };
    };

    loadImage();
  }, [name]);

  // Descargar el certificado como PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    try {
      const link = document.createElement('a');
      link.download = 'certificado.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al descargar el certificado:', error);
      alert('No se puede descargar el certificado debido a un problema con la imagen.');
    }
  };

  // Regresar a la página anterior
  const handleBack = () => {
    navigate(-1);
  };

  // Compartir en redes sociales
  const handleShare = async () => {
    const canvas = canvasRef.current;
    const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

    if (navigator.share) {
      const file = new File([imageBlob], 'certificado.png', { type: 'image/png' });
      navigator.share({
        title: 'Certificado',
        text: '¡Mira el certificado que he recibido!',
        files: [file],
      }).catch((error) => console.error('Error al compartir:', error));
    } else {
      alert('La función de compartir no está soportada en este navegador.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      transform: window.innerWidth <= 768 ? 'translateY(-50px)' : 'translateY(0)',
      padding: '20px',
    }}>
      {/* Botón para regresar */}
      <img
        src="https://appbsf.blob.core.windows.net/navidad/botón_regresar.png"
        alt="Regresar"
        style={{
          width: '150px',
          height: 'auto',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
        onClick={handleBack}
      />

      {/* Canvas para el certificado */}
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '20px',
          width: '380px',
          height: '480px',
        }}
      />

      {/* Botones para compartir y descargar */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <img
          src="https://appbsf.blob.core.windows.net/navidad/compartir.webp"
          alt="Compartir"
          style={{
            width: '150px',
            height: 'auto',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          onClick={handleShare}
        />
        <img
          src="https://appbsf.blob.core.windows.net/navidad/descargar.webp"
          alt="Descargar"
          style={{
            width: '150px',
            height: 'auto',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          onClick={handleDownload}
        />
      </div>
    </div>
  );
};

export default PreviewCertificate;
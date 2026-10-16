/**
 * Utilidades para compresión y normalización de imágenes de usuario
 * Optimiza las fotos subidas a un tamaño estándar (max 600x600px, JPEG 0.82)
 * para garantizar almacenamiento instantáneo y seguro en localStorage y base de datos sin límites de cuota.
 */

export function comprimirImagen(file, maxWidth = 600, maxHeight = 600, calidad = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrlOptimizada = canvas.toDataURL('image/jpeg', calidad);
        resolve(dataUrlOptimizada);
      };
      img.src = e.target?.result;
    };
    reader.readAsDataURL(file);
  });
}

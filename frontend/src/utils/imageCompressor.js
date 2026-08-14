/**
 * Compresses an image file using HTML5 Canvas.
 * Returns a Promise that resolves to a base64 Data URL or a Blob.
 * 
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Max width of the compressed image
 * @param {number} maxHeight - Max height of the compressed image
 * @param {number} quality - JPEG compression quality (0 to 1)
 * @returns {Promise<string>} Base64 string of compressed image
 */
export function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type. Must be an image.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions keeping aspect ratio
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
        ctx.drawImage(img, 0, 0, width, height);

        // Compress and get Data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

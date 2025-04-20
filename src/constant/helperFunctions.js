import imageCompression from 'browser-image-compression';

export const handleFileChange = async (e , file) => {

  const options = {
    maxSizeMB: 1,               // Max size in MB
    maxWidthOrHeight: 1024,     // Resize image
    useWebWorker: true,         // Better performance
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile
  } catch (error) {
    console.error('Compression Error:', error);
    return file
  }
};

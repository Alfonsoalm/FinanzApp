import CryptoJS from 'crypto-js';

// Clave de cifrado, asegúrate de usar la misma que usaste en MySQL
const key = "cetemet";

// Función para cifrar texto
export function encryptText(text) {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

export function decryptText(encryptedText) {
    // Desencriptamos usando CryptoJS
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    
    // Convertimos los bytes desencriptados a texto (utf8)
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
  
    return originalText;
}
import admin from "firebase-admin";
import serviceAccount from "@/lib/sms-sender-b3081-firebase-adminsdk-fbsvc-a2c95cba0e.json"

// const serviceAccount = {
//   type: process.env.FIREBASE_TYPE,
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvw1GRjS7QBO3O\nYu7C2aJotkvoPiKSLCkIPVwaJonSE7b8ufiUTRyXdlrNqeUY2Hauvf/0u9cLgVnY\nQ9VaMn0+HpoWeXDYRNgBj09baXbxLGDkUdXR7AoJ8fxX/GxBQkgb8eN7yw84Bif5\n/R0p01lDFq7uvyh9krnC9TTUId0YXjfgTv/gc8oYIXsXCaYMQzwzKEli0f6ZLG9r\nKApNXWPYRUsahTecPj/8PcpIev8KqKIlCzK2kb/YbwgsNDviJV6o60ed4WVE3ncb\ngwuIt8nsCukBac/qXyK7RnIChJ8fECPxHUc86VVsEPpUPWt45kFC5kp/ZpcXow2P\nuR2LH+UrAgMBAAECggEAB3AvJAdDC2eh/sF+FD3smxzX4oi6os/+nowmOS8XVw4h\niNl/9Rq8UoaeOiTt/pqujx+YVO2cIK8FM9tPDKWlWjsmTzwtc+GZ+Jrtg1NXxsYX\nhaIW9+7Sz+/vO3QBytM4xQH8HBGQX9EW4QP+t3XryaSMm6r4VjQe62rAJRgXyL+m\nABkj7i1aPXb/lYc3IOYsXVoRptY1ol3XSusTFLnjB76hkorWt3an2Bhe929cON+v\nmaqgEu9VTsKCrC0VS8owX8czuGHWBrPxa4Lsvad9Vaak7oMOnKju3uw+tXucdlkp\nSxoKnBdzyjP5i8fpnXmpIH1qeoOr1vnoq0HSMhqkqQKBgQDllGyzwVWgVk4ZfCZQ\nWmAMVLKzbQyx3fH3J4hj4GtD/pWiTOlGGtPps7UUfn2ZL9yWjaRpME2GXQhrya91\nEQYkXUgCTj3qhEeS05+5H/L+ARZuSA/kEGNRX2PDynamD1d2q9YhstKgLgrgGPDR\nFgE25JieKe6Q63hgJlSS8Wv++QKBgQDD/WoGZ3TjfGR5ySZgtuPa2zwgm0gAkze7\nb6n87ls7nwNk8fAw+0QYdsHuhs9TGIJvzIv2eFZiu4V+AA4IUSV9N7GIFXuo2od3\nRrPPJfeEglUcsysFNu2CFa3TTat91397iqiBgZdXipBk7TcnBNwIF9OnFD5ZRulQ\nZubIugX6QwKBgQC5PA6Q4rdBzSDqsx7+ykyg5l3hI2WQxbELZ9xGKbaif/EfqMq3\nA8Jj19mNFZolVVa4KsSzEoQam0nGHk7xN7Eq+hC1u4d9hwlw0EsZRUv74cjFZmNb\n8lUQPNT0DpG43rwFRhRZ0DzdfQjNU5JKQWTtc3godVDFoRfZDFRE04H9kQKBgDJ3\nDxTlEMD+p7SAKeSfUx5ocxwGP8z+G0ylHQUmrtE0SaB1d551JHyUH612gu3nkraM\n2cE2DTBRDrd59iMIGfobHBhpR7Ubx+PbjbMaGJjDIn1IWRx3n0JuqJqPFkhJ8+Zw\ntqDaKIj/Ad0rA5eFdc6TrAkKel9slekBBg3LcHyXAoGBANSSEZw0/zEFnoSoSmze\nnVL26NzMy6E+QzUJO0+jr9AvPSlX9YTfEQDvU8sSihsVqjA3G1C/zPohiYZqTT+M\nMdVbJ930QDV6XacsGDWuOwZQG8WRX9v1HSU4kwfDtRA92S0R13wrh6iEmuK2zwav\nhR4d0P82D7JJKqKBW61xrJGk\n-----END PRIVATE KEY-----\n", // 🔥 important
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   client_id: process.env.FIREBASE_CLIENT_ID,
//   auth_uri: process.env.FIREBASE_AUTH_URI,
//   token_uri: process.env.FIREBASE_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
//   client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
// };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Initialize the app with your service account
let adminApp;

const privateKey ="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDG9xOjU3brVTCs\n2bkhGsEecA3sOAjsrW8oeIMsEZA66HWtuJFcWDcqjonEi/92ZLegVVX5olowTUR7\n2Z+lOcPX74kGbQbiHn77KrzUwfPlLkGnn7edvC/9wA5qc9PR4icO2PvLsTG0wE4t\ncHfJQZPI20GPhfeWprxAAnxUJXbHCuR1rvhW2YHbme1UZAiHJLSBuEjV5mz6NO42\nS6KlouS2tojlniPgAT7Za6YoZo6CuF4AhIIvaPJq5N9XZJ8K2Iw3B0pVLwYuQuvQ\njkHi7I9HlRH01ODeMRna6ZS56WhvCgrAVAPj/UwfiT1CVjIjg9gB4xHVWqof6pfK\nB85qaZRXAgMBAAECggEASh+fVdAQ9CBzN1oPkck1XCET1saTcJU2XcXz3FWYvZF/\n0d36bYRB3R1oLuyXGiTwkg9orc0xu1/13QwY4UWxc/99tYKlt1T0Kp9j5QFy2xVO\nCWRD1ERZPrgvxrHrHnyZ33qv59VWNsgT9/K39ab0Jzaj6JPYxuvMIy6p4fFpHEKG\n1ZjtwgsFnKXPAtgcWW6Vy4POjjZ4uJUYrzyV/DzFTK6hwKWraZpmbOYCd/gxJLyN\nvIO9yoEWZH2UTggSV6UNyU2qO2Sl37Tq57Hqz4Zkb8kMh6m8Mh82733plVH8NwzK\nHGI11+JWKVL7VhwdzDng6K8uNhHH4dKmtlg4230/NQKBgQDpIbyayykZKAhnM7Fg\niMP8h06wH/f9Cg53LWGoVG570nTMhGsqd5Z/Suw6TIJYatq1aGBxnV+1KKEJw61R\no/UOwwPn3+7RYb86xwoLYqfdyFuKZjaL7i27ckGnrBlHqvQcJ5oAKMzzjKv9vu9e\n/kc30HThrNKzTGquZi5yNRqt7QKBgQDae1488pkL5UoydGZFGkOD4baywsPSMvP4\nkez9bYsbEkbbyPX99ffnecZIBAWK2cKiJoTUMx2IzFlvkjZzpkG10/qft4NO8JtB\neAVv3amhBIhxUN5jErGW3ShxDInQcwvD1hvH6Zgd8b+ABFUsjHYRM4ghJBc6eahI\ny11EM0Xi0wKBgQDPNN4WUuXXZx5445gO7eAL7hNBNVjLvYl34Yz/+PMt+LM5J6S8\nXQgVYXkuo9viTC7Rt9CoirCLKm5faFz+yBRCJ5CsIft4fEFkM4446lm7JJ5AF3L5\n0hsxlG7IYY0ihs5qy8Pzyk/HVEt1v6OvsZ+I+y03e8zV8eCL22QCvDJXTQKBgQCe\nT8Z5Y1CCziJ1bOKuL9m8NlGsNnSuWz1tYE/ZUwb5FsVBfNzCqPh5QkPq6v8ZHbFq\nzX5yRJeiCHDF56yNIGt81Z1FHjSHftEBH3bRGE1R33b+pRp/r4v/RUGIqQ0zfimI\nPhzjPuB60jFxEbKmFSF4VV7OpNgwBvdpx/JM+NorAQKBgBLGUkW749VSc0bKkukc\n7dmyngLyMedtn+nCMoSaprafdE8dZ8qPsZ7i8LcdEK+ckurt95Cb1ol5zUaq8Ej3\nhLOC99mAw6hffCrDT35fkTIFsmF9CViQ0IRjnOHA865B9pifz+Z03Wng9I7vRNHM\nW9dN/xukxBCTFO+EVKe3Lp3q\n-----END PRIVATE KEY-----\n"

try {
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error("Firebase init error:", error);
}


export const admin = {
  messaging: () => getMessaging(adminApp),
};

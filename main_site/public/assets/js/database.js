var firebaseConfig = {
    apiKey: "AIzaSyASTlXTPfvfpZdTYp-Lv8_l7z-s255sDYM",
    authDomain: "robotronicsclubwebsite.firebaseapp.com",
    databaseURL: "https://robotronicsclubwebsite.firebaseio.com",
    projectId: "robotronicsclubwebsite",
    storageBucket: "robotronicsclubwebsite.appspot.com",
    messagingSenderId: "714064283972",
    appId: "1:714064283972:web:fd9c56cd67dbabf82a6f11",
    measurementId: "G-0WG9E07BLD"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let db=firebase.firestore();
  db.settings({timestampsInSnapshots:true});

  db.collection('inventory').get().then((data_items) => {
    data_items.docs.forEach(doc => {
        console.log(doc.data());
    });
  })
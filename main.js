const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyApzaUbCad-8VciNeuH1UTSkCrAct8Tn2o",
  authDomain: "redes3snmp.firebaseapp.com",
  databaseURL: "https://redes3snmp.firebaseio.com",
  projectId: "redes3snmp",
  storageBucket: "redes3snmp.appspot.com",
  messagingSenderId: "155892603157",
  appId: "1:155892603157:web:eafc893180ac8936b9711c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const SNMPFunctions = require("./SNMPFunctions");

setInterval(function() {
  firebase
    .firestore()
    .collection("Servidores")
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(servidor => {
        var fn = new SNMPFunctions();
        fn.Monitorear(
          servidor.data().ip,
          servidor.data().comunidad,
          servidor.data().OIDS,
          servidor.id
        );
      });
    });
  /*fn.Monitorear("192.168.0.29", "public", [
    "1.3.6.1.2.1.1.5.0",
    "1.3.6.1.2.1.1.6.0"
  ]);*/
}, 5000);

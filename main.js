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
  try {
    firebase
      .firestore()
      .collection("Servidores")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(servidor => {
          firebase
            .firestore()
            .collection("OIDS")
            .onSnapshot(snapShot => {
              snapShot.forEach(OIDdoc => {
                var fn = new SNMPFunctions();
                if (OIDdoc.data().oidref)
                  fn.Monitorear(
                    servidor.data().ip,
                    servidor.data().comunidad,
                    [OIDdoc.data().oid, OIDdoc.data().oidref],
                    servidor.id,
                    OIDdoc.data().nombre,
                    OIDdoc.data().unused
                  );
                else
                  fn.MonitorSimple(
                    servidor.data().ip,
                    servidor.data().comunidad,
                    [OIDdoc.data().oid],
                    servidor.id,
                    OIDdoc.data().nombre
                  );
              });
            });
        });
      });

    //setInterval(function() {
    //var fn = new SNMPFunctions();
    //fn.Monitorear("192.168.0.51", "public", ["1.3.6.1.4.1.2021.4.6.0"]);
  } catch (ex) {
    console.log(ex.message);
  }
}, 2000);

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
const ping = require('ping');
const notification = require('./Notofication');
setServerAlive = serverid => {
  firebase
      .firestore().collection("Servidores").doc(serverid).update({alive:true});
};

setServerDead = (serverid,ip,comunidad) => {
  firebase
      .firestore().collection("Servidores").doc(serverid).update({alive:false});
  var notify = new notification();
  notify.sendNotification("facebook",ip,comunidad,"está muerto")
};

firebase
      .firestore()
      .collection("Servidores")
      .get().then(querySnapshot => {
        querySnapshot.forEach(servidor => {
          ping.sys.probe(servidor.data().ip, function(isAlive){
            if(isAlive)setServerAlive(servidor.id);
            else setServerDead(servidor.id,servidor.data().ip,servidor.data().comunidad);
            }
        );
        });
      });


      firebase
      .firestore()
      .collection("Servidores")
      .where("alive","==",true)
      .get().then(querySnapshot => {
        querySnapshot.forEach(servidor => {
          firebase
            .firestore()
            .collection("OIDS")
            .where("once","==",true)
            .get().then(snapShot => {
              snapShot.forEach(OIDdoc => {
                var fn = new SNMPFunctions();
                  fn.MonitorOnce(
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
 setInterval(function() {
  try {
    firebase
      .firestore()
      .collection("Servidores")
      .where("alive","==",true)
      .get().then(querySnapshot => {
        querySnapshot.forEach(servidor => {
          firebase
            .firestore()
            .collection("OIDS")
            .where("once","==",false)
            .get().then(snapShot => {
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
  } catch (ex) {
    console.log(ex.message);
  }
}, 2000);

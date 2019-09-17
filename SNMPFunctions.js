const firebase = require("firebase");
var snmp = require("net-snmp");

class SNMPFunctions {
  constructor() {
    this.db = firebase.firestore();
  }

  createServer(ip, comunidad, oids) {
    return this.db
      .collection("Servidores")
      .add({
        ip: ip,
        comunidad: comunidad,
        OIDS: oids
      })
      .then(refdoc => {
        console.log(`ID del post insertado: ${refdoc.id}`);
      })
      .catch(error => {
        console.log(`Hubo error en: ${error}`);
      });
  }

  registerActivity(ip, comunidad, oid, value) {
    return this.db
      .collection("Registros")
      .add({
        ip: `${ip}`,
        comunidad: `${comunidad}`,
        OID: `${oid}`,
        value: `${value}`
      })
      .then(refdoc => {
        console.log(`ID del post insertado: ${refdoc.id}`);
      })
      .catch(error => {
        console.log(`Hubo error en: ${error}`);
      });
  }

  async Monitorear(ip, comunidad, oids) {
    var session = snmp.createSession(ip, comunidad);
    var binds = [];
    let promise = new Promise((resolve, reject) => {
      session.get(oids, function(error, varbinds) {
        if (error) {
          console.error(error);
        } else {
          for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError(varbinds[i]))
              console.error(snmp.varbindError(varbinds[i]));
            else {
              binds.push(varbinds[i]);
              console.log(`1.${i} // ` + binds[i].oid + " = " + binds[i].value);
            }
          resolve("ok");
        }
        // If done, close the session
        session.close();
      });

      session.trap(snmp.TrapType.LinkDown, function(error) {
        if (error) console.error(error);
      });
    });
    let result = await promise;
    console.log(`binds length: ${binds.length}`);
    for (var i = 0; i < binds.length; i++) {
      console.log(`2.${i} // ` + binds[i].oid + " = " + binds[i].value);
      this.registerActivity(ip, comunidad, binds[i].oid, binds[i].value);
    }
  }
}

module.exports = SNMPFunctions;

const firebase = require("firebase");
var snmp = require("net-snmp");
const notification = require('./Notofication');
const notify = new notification();

class SNMPFunctions {
  constructor() {
    this.db = firebase.firestore();
  }

  registerActivity(serverid, oidname, value, refvalue) {
    this.db
      .collection("Servidores")
      .doc(serverid)
      .collection("Registros")
      .add({
        value: `${value}`,
        refvalue: `${refvalue}`,
        oidName: oidname,
        date: firebase.firestore.Timestamp.fromDate(new Date())
      })
      .catch(error => {
        throw error
      });
  }

  registerActivitySimple(serverid, oidname, value) {
    this.db
      .collection("Servidores")
      .doc(serverid)
      .collection("Registros")
      .add({
        value: `${value}`,
        oidName: oidname,
        date: firebase.firestore.Timestamp.fromDate(new Date())
      })
      .catch(error => {
        throw error
      });
  }

  registerActivityOnce(serverid, oidname, value) {
    this.db
      .collection("Servidores")
      .doc(serverid)
      .update({
        [oidname]: `${value}`,
      })
      .catch(error => {
        throw error
      });
  }

  async Monitorear(ip, comunidad, oids, serverid, oidname, unused) {
    var session = snmp.createSession(ip, comunidad);
    var binds = [];
    var bigError;
    var value;
    let promise = new Promise((resolve, reject) => {
      session.get(oids, function(error, varbinds) {
        if (error) bigError = error;
        else
          for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError(varbinds[i]))
            bigError = snmp.varbindError(varbinds[i]);
            else binds.push(varbinds[i]);

        resolve("ok");
        // If done, close the session
        session.close();
      });
      session.trap (snmp.TrapType.LinkDown, function (error) {
        if (error)
            bigError = error;
    });
    });
    let result = await promise;
    if (bigError) {
      notify.sendNotification("facebook","El servidor " + ip," con comunidad " + comunidad + " sufre de ",bigError);
      throw BigError
    } else {
      binds = binds[0].oid == oids[0] ? binds : binds.reverse();
      var value =
        unused == true ? binds[1].value - binds[0].value : binds[0].value;
      this.registerActivity(serverid, oidname, value, binds[1].value);
    }
  }

  async MonitorSimple(ip, comunidad, oids, serverid, oidname) {
    var session = snmp.createSession(ip, comunidad);
    var binds = [];
    var bigError;
    let promise = new Promise((resolve, reject) => {
      session.get(oids, function(error, varbinds) {
        if (error) bigError = error;
        else
          for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError(varbinds[i]))
              bigError = snmp.varbindError(varbinds[i]);
            else binds.push(varbinds[i]);

        resolve("ok");
        // If done, close the session
        session.close();
      });
    });
    let result = await promise;
    if (bigError) {
  notify.sendNotification("facebook","El servidor " + ip," con comunidad " + comunidad + " sufre de ",bigError);
      throw BigError
    } else {
      this.registerActivitySimple(serverid, oidname, binds[0].value);
    }
  }

  async MonitorOnce(ip, comunidad, oids, serverid, oidname) {
    var session = snmp.createSession(ip, comunidad);
    var binds = [];
    var bigError;
    let promise = new Promise((resolve, reject) => {
      session.get(oids, function(error, varbinds) {
        if (error) bigError = error;
        else
          for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError(varbinds[i]))
              bigError = snmp.varbindError(varbinds[i]);
            else binds.push(varbinds[i]);

        resolve("ok");
        // If done, close the session
        session.close();
      });
    });
    let result = await promise;
    if (bigError) {
  notify.sendNotification("facebook","El servidor " + ip," con comunidad " + comunidad + " sufre de ",bigError);
      throw BigError
    } else {
      this.registerActivityOnce(serverid, oidname, binds[0].value);
    }
  }
}

module.exports = SNMPFunctions;

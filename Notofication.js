const axios = require('axios')

class Notification{
    sendNotification(event,val1,val2,val3){
      axios.post('https://maker.ifttt.com/trigger/notificar/with/key/d2sCAW4Y-k6OnKgv9xZ3xyiCgWu5FRQfpr2xfEjesw3', {"value1":val1,"value2":val2,"value3":val3})
        .catch((error) => {
          console.error(error)
        })
        axios.post('https://maker.ifttt.com/trigger/facebook/with/key/d2sCAW4Y-k6OnKgv9xZ3xyiCgWu5FRQfpr2xfEjesw3', {"value1":val1,"value2":val2,"value3":val3})
        .catch((error) => {
          console.error(error)
        })
        axios.post('https://maker.ifttt.com/trigger/sendMessage/with/key/d2sCAW4Y-k6OnKgv9xZ3xyiCgWu5FRQfpr2xfEjesw3', {"value1":val1,"value2":val2,"value3":val3})
        .catch((error) => {
          console.error(error)
        })
        axios.post('https://maker.ifttt.com/trigger/TrapDetected/with/key/d2sCAW4Y-k6OnKgv9xZ3xyiCgWu5FRQfpr2xfEjesw3', {"value1":val1,"value2":val2,"value3":val3})
        .catch((error) => {
          console.error(error)
        })
        
    }
}

module.exports = Notification;


async function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function commandrand() {
    return getRandom(1, 31)
}
  
async function wintand() {
    return getRandom(1, 2)
}

function getTime() {
    let date = new Date();
    let year = date.getFullYear()
    let month = parseInt(date.getMonth() + 1)
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    result = day + "." + month + "." + year + " в " + hours + ":" + minutes
    return result
}

function padezh(int) {
    let check = ["2", "3", "4"]
    let r1 = "игрок заберет"
    let r2 = "игрока поделят между собой"
    let r3 = "игроков поделят между собой"
    if (int == 1){
      return r1
    }
    if (check.includes(`${int}`)) {
      return r2
    } else {
      return r3
    }
}
  
function padezh2(int) {
    let check = ["2", "3", "4"]
    let r1 = "раза"
    let r2 = "раз"
    if (int == 1 || int > check[2]) {
        return r2
    } else {
        return r1
    }
}
  
function formular(sum, rb, bb) {
    let f1 = parseFloat(sum) / parseFloat(rb)
    let f2 = parseFloat(f1) * parseFloat(bb)
    let f3 = parseFloat(f2) + parseFloat(sum)
    return f3
}

function formulab(sum, rb, bb) {
      let f1 = parseFloat(sum) / parseFloat(bb)
      let f2 = parseFloat(f1) * parseFloat(rb)
      let f3 = parseFloat(f2) + parseFloat(sum)
      return f3
}
  
function com(num, com) {
    let proc = "0" + "." + com
    let comission = parseFloat(num) * parseFloat(proc)
    let result = parseFloat(num) - parseFloat(comission)
    return result
}

module.exports = {
    getRandom,
    commandrand,
    wintand,
    getTime,
    padezh,
    padezh2,
    formular,
    formulab,
    com
}
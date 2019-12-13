/*
  UniFortune
  Copyright (C) 2019 rfoxxxy(t.me/rfoxxxyofficial)
  rfoxxxy is a founder and headliner of rfoxxxyz studio(vk.com/rfoxxxyzstudio)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

/* ВНИМАНИЕ!!!
  Пожалуйста, если вы заглянули в код, не бейте меня за говно, прошу.
  Я в это время только учился и не знал что такое табуляция
  и зачем она нужна, так же не знал про некоторые
  фичи, такие как "aye['aye']" и находил значение в массиве 
  используя indexOf.

  Надеюсь, вы меня поняли.
*/

const colors = require('colors');
console.log('Initializing @botzcore/UniFortune... // by rfoxxxyz studio'.blue.bold);
console.log('UniFortune >> Стартую...'.yellow.bold);

// Модули
const { VK, Keyboard } = require('vk-io');
const vk = new VK();
const os = require('os');
const Express = require('express');
const bodyParser = require('body-parser');
const app = Express();
// database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('fortunebase/db.json');
const db = low(adapter);
const { 
  adminlist,
  replacelist,
  mainChat,
  logChat,
  mainChatLink,
  VKToken,
  VKID,
  UNI_MerchantGroup,
  UNI_APIKey,
  UNI_Secret,
  UNI_Confirmation,
  CallBackPort
} = require('./config')
const {
  getRandom,
  commandrand,
  wintand,
  getTime,
  padezh,
  padezh2,
  formular,
  formulab,
  com
} = require('./tools/funcs')

db.defaults({ users: [], games: [] }).write();

db.getUser = async(ID) => {
  let user = db.get('users').find({ id: ID }).value();
  if (!user) {
    db.get('users').push({
      id: ID,
      userID: db.get('users').value().length + 1,
      rcount: 0,
      bcount: 0,
      bsums: 0,
      sums: 0,
      wint: 0,
      regtime: getTime(),
      lasts: 0,
      nick: (await vk.api.users.get({ user_ids: ID }))[0].first_name,
      team: 0,
      ban: {
        isBanned: false,
        reason: ''
      }
    }).write();
    user = db.get('users').find({ id: ID }).value();
  }
  return user;
};

db.getGames = async() => {
  let games = db.get('games').find().value();
  if (!games) {
    db.get('games').push({
      bluebank: 0,
      redbank: 0,
      blueplayers: 0,
      redplayers: 0,
      blueids: [],
      redids: [],
      blues: [],
      reds: []
    }).write();
    games = db.get('games').find().value();
  }
  return games;
};

const board1 = Keyboard.keyboard([
[
		Keyboard.textButton({
			label: '❓Как играть',
			payload: {
				command: 'howtoplay'
			}
		})
	],
	[
		Keyboard.textButton({
			label: '📥Пополнить',
			payload: {
				command: 'payin'
			},
			color: Keyboard.POSITIVE_COLOR
		}),
		Keyboard.textButton({
			label: '💰Банк',
			payload: {
				command: 'bank'
			},
			color: Keyboard.PRIMARY_COLOR
		})
	],
	[
	     Keyboard.textButton({
		     label: '👤Профиль',
		     payload: {
			   command : 'profile'
			},
			color: Keyboard.NEGATIVE_COLOR
			})
			]
	])
	
const board2 = Keyboard.keyboard([
  [
    Keyboard.textButton({
      label: '🔗Беседа игры',
      payload: {
      	command: 'beseda'
      },
      color: Keyboard.PRIMARY_COLOR
      })
    ]
  ]
)

async function fortune(from, sum, code) {
  let VK = await vk.api.users.get({
    user_ids: from,
    fields: 'status'
  });
  let VKID = VK[0].id;
  const ussr = await db.getUser(VKID);
	let gamed = await db.getGames();
	let redidss = gamed.redids;
	let blueidss = gamed.blueids
	let rplay = gamed.redplayers
	let bplay = gamed.blueplayers
	let redcontains = redidss.includes(`${VKID}`)
	let bluecontains = blueidss.includes(`${VKID}`)
        if (redcontains || bluecontains) {
            if (bluecontains) {
            	let geim = await db.getGames();
              let player = await db.getUser(VKID)
              let sums = player.sums
              let arr = geim.blues
              let arr2 = geim.blueids
              let pos = (arr2).indexOf(`${from}`)
              let nws = parseFloat(arr[pos]) + parseFloat(sum)
              arr.splice(pos, 0, nws)
              player.sums = parseFloat(sums) + parseFloat(sum)
              let stavka = geim.bluebank
              geim.bluebank = parseFloat(stavka) + parseFloat(sum);
              geim.blues = arr
              db.write();
              let sost = (arr[pos]).toFixed(3)
              vk.api.messages.send({ chat_id: mainChat, message: `[📥] [id${ussr.id}|${ussr.nick}] дополнил(-а) свою ставку на ${sum}UC. \nТеперь его(её) ставка составляет ${sost} UC`});
              vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Новое дополнение ставки: [id${ussr.id}|${ussr.nick}]. Сумма: ${sum} UC. Код: [${code}]. Определен в команду: [blue]` });
              return
            }
            if (redcontains) {
            	let geim = await db.getGames();
                let player = await db.getUser(VKID)
                let sums = player.sums
                let arr = geim.reds
                let arr2 = geim.redids
                let pos = (arr2).indexOf(`${from}`)
                let nws = parseFloat(arr[pos]) + parseFloat(sum)
                arr.splice(pos, 0, nws)
                player.sums = parseFloat(sums) + parseFloat(sum)
                let stavka = geim.redbank
                geim.redbank = parseFloat(stavka) + parseFloat(sum)
                geim.reds = arr
                db.write();
                let sost = (arr[pos]).toFixed(3)
                vk.api.messages.send({ chat_id: mainChat, message: `[📥] [id${ussr.id}|${ussr.nick}] дополнил(-а) свою ставку на ${sum} UC. \nТеперь его(её) ставка составляет ${sost} UC`});
                vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Новое дополнение ставки: [id${ussr.id}|${ussr.nick}]. Сумма: ${sum} UC. Код: [${code}]. Определен в команду: [red]` });
                return
            }
            }
         if (sum < 1.5) {
     vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Новая обнуленная ставка: [${ussr.id}|${ussr.nick}]. Сумма: ${sum} UC. Код: [${code}]. Определен в команду: [неизвестно]` });
     let player = await db.getUser(VKID)
                let bsums = player.bsums
                player.bsums = parseFloat(bsums) + parseFloat(sum)
	return vk.api.messages.send({ chat_id: mainChat, message: `[📥] [id${ussr.id}|${ussr.nick}] сделал ставку в ${sum}UC и его ставка аннулирована. \n Минимальная ставка - 1.5UC`})
	}
        let command = await commandrand();
        if (command  <= 15) {
        	if (bplay == 3 && rplay < 3) {
        	vk.api.messages.send({ chat_id: mainChat, message: `[📥] [id${ussr.id}|${ussr.nick}] сделал ставку в ${sum} UC и был автоматически определен в Красную команду` });
        let game = await db.getGames()
        let rbalance = game.redbank
        let players = game.redplayers
        game.redbank = parseFloat(rbalance) + parseFloat(sum)
        game.redplayers = parseInt(players) + parseInt(1)
        let redids = game.redids
        let redbanks = game.reds
	      let reds = redbanks.push(`${sum}`);
        let ids = redids.push(`${VKID}`);
        game.redids = redids
        game.reds= redbanks
        db.write()
        let user = await db.getUser(VKID)
        user.games = parseInt(user.games) + parseInt(1)
         let sums = user.sums
        user.sums = parseFloat(sums) + parseFloat(sum)
        user.rcount = parseInt(user.rcount) + parseInt(1)
        db.write()
        vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Новая ставка: [id${user.id}|${user.nick}]. Сумма: ${sum} UC. Код: [${code}]. Определен в команду: [red]` });
        return
        }
        vk.api.messages.send({ chat_id: mainChat, message: `[📥] [id${ussr.id}|${ussr.nick}] сделал ставку в ${sum} UC и был автоматически определен в Синюю команду` });
        let game = await db.getGames()
        let rbalance = game.bluebank
        let players = game.blueplayers
        game.bluebank = parseFloat(rbalance) + parseFloat(sum)
        game.blueplayers = parseInt(players) + parseInt(1)
	      let blueids = game.blueids
	      let bluebanks = game.blues
	      let blues = bluebanks.push(`${sum}`)
        let ids = blueids.push(`${VKID}`);
        game.blueids = blueids
        game.blues = bluebanks
        db.write()
        let user = await db.getUser(VKID)
        user.games = parseInt(user.games) + parseInt(1)
         let sums = user.sums
        user.sums = parseFloat(sums) + parseFloat(sum)
        user.bcount = parseInt(user.bcount) + parseInt(1)
        db.write()
        vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Новая ставка: [id${user.id}|${user.nick}]. Сумма: ${sum} UC. Код: [${code}]. Определен в команду: [blue]` });
        return
        } 
        if (command >= 16) {
        	if (rplay == 3 && bplay < 3) {
        	vk.api.messages.send({ chat_id: mainChat, message: `[📥] [id${ussr.id}|${ussr.nick}] сделал ставку в ${sum} UC и был автоматически определен в Синюю команду` });
        let game = await db.getGames()
        let rbalance = game.bluebank
        let players = game.blueplayers
        game.bluebank = parseFloat(rbalance) + parseFloat(sum)
        game.blueplayers = parseInt(players) + parseInt(1)
	      let blueids = game.blueids
	      let bluebanks = game.blues
	      let blues = bluebanks.push(`${sum}`)
        let ids = blueids.push(`${VKID}`);
        game.blueids = blueids
        game.blues = bluebanks
        db.write()
        let user = await db.getUser(VKID)
        user.games = parseInt(user.games) + parseInt(1)
         let sums = user.sums
        user.sums = parseFloat(sums) + parseFloat(sum)
        user.bcount = parseInt(user.bcount) + parseInt(1)
        db.write()
        vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Новая ставка: [id${user.id}|${user.nick}]. Сумма: ${sum} UC. Код: [${code}]. Определен в команду: [blue]` });
        return
        }
        vk.api.messages.send({ chat_id: mainChat, message: `[📥] [id${ussr.id}|${ussr.nick}] сделал ставку в ${sum} UC и был автоматически определен в Красную команду` });
        let game = await db.getGames()
        let rbalance = game.redbank
        let players = game.redplayers
        game.redbank = parseFloat(rbalance) + parseFloat(sum)
        game.redplayers = parseInt(players) + parseInt(1)
        let redids = game.redids
        let redbanks = game.reds
	      let reds = redbanks.push(`${sum}`);
        let ids = redids.push(`${VKID}`);
        game.redids = redids
        game.reds= redbanks
        db.write()
        let user = await db.getUser(VKID)
        user.games = parseInt(user.games) + parseInt(1)
         let sums = user.sums
        user.sums = parseFloat(sums) + parseFloat(sum)
        user.rcount = parseInt(user.rcount) + parseInt(1)
        db.write()
        vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Новая ставка: [id${user.id}|${user.nick}]. Сумма: ${sum} UC. Код: [${code}]. Определен в команду: [red]` });
        return
        }
    return 
}

vk.setOptions({
    'token': VKToken,
    'apiMode': "parallel",
    'pollingGroupId': VKID,
    'apiVersion': 5.101
  });
async function unisend(ID, sum) {
	let unicode = await getRandom(-20000000, 20000000)
	request({
    method: "POST",
    url:"https://uc.simbrex.com/api/merchant/transfer.php",
    form:{
      merchant_id: UNI_MerchantGroup,
      key: UNI_APIKey,
      to: ID,
      sum: sum,
      code: unicode,
    }
  }, function(e, h, ans){
	  let decode = JSON.parse(ans)
	  console.log(ans)
	  return vk.api.messages.send({ chat_id: logChat, message: `[FortuneLogs] Исходящий перевод: ${decode.sum}UC. Получатель: *id${decode.to}. Код: ${unicode} \nСтатус: ${decode.status}` });
  });
  return
}

async function endgame() {
	let gmms = await db.getGames();
	let redplayers = gmms.redplayers
	let blueplayers = gmms.blueplayers
  let redbanks = gmms.redbank
  let rcomission = parseFloat(redbanks) * parseFloat(0.06)
  let redbank = parseFloat(redbanks) - parseFloat(rcomission)
  let bluebanks = gmms.bluebank
  let bcomission = parseFloat(bluebanks) * parseFloat(0.06)
  let bluebank = parseFloat(bluebanks) - parseFloat(bcomission)
  let totally = parseFloat(bluebank) + parseFloat(redbank)
  let tt = (totally).toFixed(3)
	let redids = gmms.redids
	let blueids = gmms.blueids
	let blues = gmms.blues
	let reds = gmms.reds
	const win = await wintand();
  if (blueplayers == 0 || redplayers == 0) {
      return
      }
  if (win === 1) {
    vk.api.messages.send({ chat_id: mainChat, message: `[🏆] Победила Синяя команда. ${blueids.length} ${padezh(blueids.length)} ${tt} UniCoins.` });
    for(var i = 0; i < blueids.length;i++){
          (async function(s){
          	if (blueplayers == 1) {
          	unisend(blueids[i], totally)
              let VK = await vk.api.users.get({
                 user_ids: blueids[i],
                 fields: 'status'
              });
              let VKID = VK[0].id;
              let user = await db.getUser(VKID)
              let win = !user.wint ? '0' : user.wint
              user.wint = parseFloat(win) + parseFloat(sum)
              db.write();
          } else {
          let comis = com(blues[i], '06')
          let sum = formulab(comis, redbank, bluebank)
          unisend(blueids[i], sum)
          let VK = await vk.api.users.get({
            user_ids: blueids[i],
            fields: 'status'
        });
         let VKID = VK[0].id;
         let user = await db.getUser(VKID)
         let win = !user.wint ? '0' : user.wint
         user.wint = parseFloat(win) + parseFloat(sum)
         db.write();
         }
        })(i);
  }
  } else {
    vk.api.messages.send({ chat_id: mainChat, message: `[🏆] Победила Красная команда. ${redids.length} ${padezh(redids.length)} ${tt} UniCoins.` });
    for(var i = 0; i < redids.length;i++){
          (async function(s){
          if (redplayers == 1) {
          	unisend(redids[i], totally)
              let VK = await vk.api.users.get({
                 user_ids: redids[i],
                 fields: 'status'
              });
              let VKID = VK[0].id;
              let user = await db.getUser(VKID)
              let win = !user.wint ? '0' : user.wint
              user.wint = parseFloat(win) + parseFloat(sum)
              db.write();
          } else {
          let comis = com(reds[i], '06')
          let sum = formular(comis, redbank, bluebank)
          unisend(redids[i], sum)
          let VK = await vk.api.users.get({
            user_ids: redids[i],
            fields: 'status'
        });
         let VKID = VK[0].id;
         let user = await db.getUser(VKID)
         let win = !user.wint ? '0' : user.wint
         user.wint = parseFloat(win) + parseFloat(sum)
         db.write();
         }
        })(i);
  }
}
    vk.api.messages.send({ chat_id: mainChat, message: `[✔️] Коины отправлены победителям. Начат следующий раунд.` });
    let gms = await db.getGames();
    gms.blueplayers = 0
    gms.redplayers = 0
    let redidss = gms.redids
    let blueidss = gms.blueids
    let bluess = gms.blues
    let redss = gms.reds
    bluess.length = 0
    redss.length = 0
    blueidss.length = 0
    redidss.length = 0
    gms.redids = redidss
    gms.blueids = blueids
    gms.reds = reds
    gms.blues = blues
    gms.redbank = 0
    gms.bluebank = 0
    db.write();
    return
}

vk.updates.use(async (msg, next) => {
  if (msg.is("typing_user") || msg.is("join_group_member") || msg.is("new_wall_post")) {
  	return
  }
  if (msg.is("message") && msg.isOutbox) {
        return;
    }
  console.log(`PizdecCore >> `.green.bold + msg.subTypes[0] + ` ${msg.senderId} => ${msg.text}`.green.bold);
  
  msg.text = msg.text.replace(replacelist, '');
  msg.user = await db.getUser(msg.senderId);
  msg.fwds = msg.forwards || [];
  msg.answer = (text = "", params = {}) => {
    const result = `${text}`;
    return msg.send(result, params);
  };
  msg.ok = (text = "", params = {}) => {
    return msg.answer('✔️ | ' + text, params);
  };
  msg.error = (text = "", params = {}) => {
    return msg.answer('✖️ | ' + text, params);
  };
  
  if (msg.user.ban.isBanned) {
    return msg.send(`&#128213; | Вы забанены по причине: "${msg.user.ban.reason}"`);
  }
  var arg1 = msg.text.split(' ').slice(1).join(' ')
  if (msg.isChat) {
  var bcommand = msg.text.split(' ').slice(1).join(' ')
  if (bcommand == 'Начать') {
  return msg.send(`Начинай`)
  }
  }
  if (msg.text == 'Начать') {
    return msg.send({
    message: `Начинай`,
    keyboard: board2
  })
  }
  if (msg.text == '🔗Беседа игры') {
  	return msg.send(`Ссылка на беседу UniFortune: \n${mainChatLink}`)
  }
  if (!msg.isChat && msg.senderId != 166893900) {
    return msg.error(`Бот работает только в беседах!`)
  }
  if (bcommand == '💰Банк') {
  	let game = await db.getGames();
    let bluebank = game.bluebank
    let redbank = game.redbank
    let bb = (bluebank).toFixed(3)
    let rb = (redbank).toFixed(3)
    let bank = parseFloat(bluebank) + parseFloat(redbank)
    let bk = (bank).toFixed(3)
  	let result = [
      `📈Статистика текущей игры`,
      `🔵Синяя команда - ${game.blueplayers} игроков`,
      `🔴Красная команда - ${game.redplayers} игроков`,
      ``,
      `🏦Банк текущей игры`,
      redbank == 0 && bluebank == 0 ? `✖️Пока переводов не было.` : `🔵Синяя команда - ${bb} UniCoins \n🔴Красная команда - ${rb} UniCoins \n💳Общий банк: ${bk} UniCoins`,
      ``,
      redbank == 0 && bluebank == 0 ? `Розыгрыш приостановлен.` : `Розыгрыш происходит каждую минуту.`
    ].join('\n');
    return msg.send(result)
  }
  if (bcommand == '❓Как играть') {
    return msg.send(`О том, как играть, вы можете прочитать в этом посте: \n vk.com/wall-184210518_11`)
  }
  if (bcommand == '📥Пополнить') {
  	const randomness = await getRandom(1, 90000001)
    const uclink = `http://vk.com/app7037638#pay_${UNI_MerchantGroup}_0_${randomness}`
    msg.send(`[📥]Пополнение банка раунда: \n \nСсылка для пополнения банка раунда: \n${uclink} \n \nМинимальная ставка: 1.5 UC`)
  }
  if (bcommand == 'test') {
    let check = adminlist.includes(`${msg.senderId}`)
    if (!check) {
      return msg.error(`У вас нет доступа к этой команде`)
    }
    return msg.send(`OK`);
  }
  if (bcommand == 'randomtest') {
    let check = adminlist.includes(`${msg.senderId}`)
    if (!check) {
      return msg.error(`У вас нет доступа к этой команде`)
    }
  	let randproof = await commandrand();
      return msg.ok(`Рандомное число: ${randproof}`)
    }
  if (bcommand == `клавиатура` || bcommand == 'Клавиатура') {
    let check = adminlist.includes(`${msg.senderId}`)
    if (!check) {
      return msg.error(`У вас нет доступа к этой команде`)
    }
	return msg.send({
	    message: `Кнопки вызваны.`,
	    keyboard: board1
	   })
  }
  if (bcommand == '👤Профиль') {
  	let usd = await db.getUser(msg.senderId)
      let sums = (usd.sums).toFixed(3)
      let win = !usd.wint ? 0 : usd.wint
      let winned = (win).toFixed(3)
      let burned = (usd.bsums).toFixed(3)
  	let result = [
      `👤Профиль игрока [id${msg.senderId}|${usd.nick}]`,
      ``,
      `💳Всего поставлено: ${sums} UC`,
      `💸Всего заработано: ${winned} UC`,
      `🔥Сумма аннулированных ставок: ${burned} UC`,
      `🔵Был за синих: ${usd.bcount} ${padezh2(usd.bcount)}`,
      `🔴Был за красных: ${usd.rcount} ${padezh2(usd.rcount)}`,
      ``,
      `🔑UID: ${usd.userID}`
    ].join('\n')
    msg.send(result)
  }
  if (bcommand == 'debug') {
  	let check = adminlist.includes(`${msg.senderId}`)
    if (!check) {
      return msg.error(`У вас нет доступа к этой команде`)
    }
    let osys = os.type() + ' ' + os.release();
    let arch = os.arch();
    let hostname = os.hostname();
    let ozu1 = parseFloat(os.totalmem()) / parseFloat(1024)
    let ozuv = parseFloat(ozu1) / parseFloat(1024)
    let ozu2 = parseFloat(os.freemem()) / parseFloat(1024)
    let ozuf = parseFloat(ozu2) / parseFloat(1024)
    let cpus = os.cpus()
    let cpu = cpus[0].model
    let result = [
      `unifortune debug`,
      ``,
      `OS Type: ${osys}`,
      `Architecture: ${arch}`,
      `Hostname: ${hostname}`,
      `Total RAM: ${ozuv}MB`,
      `Free RAM: ${ozuf}MB`,
      ``,
      `CPU: ${cpu}`
    ].join('\n')
    msg.send(result)
    return
  }
});

console.log('UniFortune >> Инициализация скрипт-листа - UniCoins...'.yellow.bold);

//  callback
console.log('UniCoinAPI >> Connected.'.magenta.bold);
app.use(Express.urlencoded());
app.post('/', async function(request, response){
    if (request.body.secret != UNI_Secret && request.body.type != 'confirmation') {
return 
}
   if (request.body.type == 'confirmation') {
   response.send(UNI_Confirmation)
   return
}
   if (request.body.type == 'transfer') {
   let from = request.body.from
   let sum = request.body.sum
   let code = request.body.code
   await fortune(from, sum, code)
   response.sendStatus(200)
   return
}
});
app.listen(CallBackPort)
// server

var gameee = setInterval(endgame, 60000);

console.log('UniFortune >> Запущен'.green.bold);

// Запускаем Полинг (Polling)
vk.updates.startPolling();

// Консолим ошибки
process.on("uncaughtException", e => {
  console.log(e);
});

process.on("unhandledRejection", e => {
  console.log(e);
})
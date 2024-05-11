require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { gameOption, againOption } = require('./options')

const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })

bot.setMyCommands([
	{
		command: '/start',
		description: 'Botni ishlatish.',
	},
	{
		command: '/info',
		description: "Kurs haqida ma'lumot",
	},
	{
		command: '/game',
		description: "O'yin o'ynash",
	},
])

const obj = {}

const startGame = async chatId => {
	await bot.sendMessage(
		chatId,
		"Kompyuter 0 dan 9gacha son o'yladi siz usha soni topishga harakat qiling"
	)
	const randomNumber = Math.floor(Math.random() * 10)
	obj[chatId] = randomNumber
	return bot.sendMessage(chatId, "To'g'ri sonni toping", gameOption)
}

const botFunction = () => {
	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id
		if (text === '/start') {
			await bot.sendSticker(
				chatId,
				'https://sl.combot.org/utyaduck/webp/9xf09f988e.webp'
			)
			return bot.sendMessage(
				chatId,
				`Assalomu alaykum xurmatli ${msg.from.first_name} sizni Shohruz's courses botida ko'rganimizdan hursandmiz😊`
			)
		}
		if (text === '/info') {
			return bot.sendMessage(
				chatId,
				`Kursga yozilish uchun ${'@shohruz_isroilov'} menga murojat qiling to'liq malmot beraman.`
			)
		}

		if (text === '/game') {
			return startGame(chatId)
		}

		bot.sendMessage(chatId, 'Uzur men sizni gapingizga tushunmayabman!')
	})

	bot.on('callback_query', msg => {
		const data = msg.data
		const chatId = msg.message.chat.id

		if (data === '/again') {
			return startGame(chatId)
		}
		if (parseInt(data) === obj[chatId]) {
			bot.sendSticker(
				chatId,
				'https://data.chpic.su/stickers/c/celebration/celebration_006.webp'
			)
			return bot.sendMessage(
				chatId,
				`Tabriklaymiz siz to'g'ri soni topdingiz, Kompyuter o'ylagan son ${obj[chatId]}`,
				againOption
			)
		} else {
			return bot.sendMessage(
				chatId,
				`Siz noto'gri sonni tanladingiz, siz tanlagan son ${data}, Kompyuter o'ylagan son ${obj[chatId]}`,
				againOption
			)
		}
	})
}

botFunction()

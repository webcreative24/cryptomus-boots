/*CMD
  command: /setTopUpAmount
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

const amount = request.text
Bot.sendMessage("You will get link to top up your balance for : " + amount)
User.setProperty("topupamount", amount, "string")
Bot.runCommand("/getPaid", { topupamount: amount })


/*CMD
  command: /getPaid
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 
  answer: Here is your payment link
  keyboard: 
  aliases: 
  group: 
CMD*/

Libs.cryptomus.setApiKey(
  "cg0Sgc6VvLxIhvS0JvA3bYm21arSZYJjLGPGohYTK6OTqohfsrj5JinVuFCnKNJWa1Da5zkBxR60iQIpEZENmXJOwErWiXIBZQmJpxmI10xIoY7idTfoLZOLJQpNPnx3"
)
Libs.cryptomus.setUuid("51bed9e4-2d1a-4728-9713-dbcdaa0272b5")
Libs.cryptomus.setPaymentUrl("https://9bf8-46-53-210-219.ngrok-free.app/")
const amount = options.topupamount.toString()
const orderId = options.orderId.toString()

if (amount) {
  const data = {
    amount: amount
  }

  if (orderId) {
    data.order_id = orderId
  }

  let answer = Libs.cryptomus.getPaymentLink(data)
} else {
  Bot.sendMessage("Something went wrong. Try again")
}


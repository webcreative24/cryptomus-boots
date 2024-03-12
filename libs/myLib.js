function hello(){
  Bot.sendMessage("Hello from lib! sergey")
}

function goodbye(name){
  Bot.sendMessage("Goodbye, " + name)
}

publish({
  sayHello: hello,
  sayGoodbyeTo: goodbye     
})

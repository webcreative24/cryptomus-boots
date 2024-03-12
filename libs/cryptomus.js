let libPrefix = 'CryptomusPayment_';

function getPaymentLink(options = {}){
  let apiKey = Bot.getProperty(libPrefix + 'ApiKey');
  let uuidKey = Bot.getProperty(libPrefix + 'Uuid');
  return 'API:'+ apiKey + 'UUID:' +uuidKey; 
}

function setApiToken(token){
  Bot.setProperty(libPrefix + 'ApiKey', token, 'string');
}

function setUuid(uuid){
  Bot.setProperty(libPrefix + 'Uuid', uuid, 'string');
}

function accept(item){
  if(item.status!='SUCCESS'){ return false }
  if(item.type!='IN'){ return false }
  let accepted_payments = Bot.getProperty(libPrefix + 'accepted_payments');
  if(!accepted_payments){ accepted_payments = {} }

  if(accepted_payments[item.txnId]==true){
    /* already accepted */
    return false;
  }

  accepted_payments[item.txnId]=true

  Bot.setProperty(libPrefix + 'accepted_payments', accepted_payments, 'json');
  return true;
}

function onAcceptPayment(){
  if(http_status=='401'){
    Bot.sendMessage('Please verify API token');
    return
  }
  let history = JSON.parse(content).data;
  let prms = params.split(' ');
  let comment = prms[0];
  let onSuccess = prms[1];
  let onNoPaymentYet = prms[2];

  let payment;
  for(it in history){
    if(history[it].comment==comment){
      payment = history[it];
      if(accept(payment)){
        Bot.runCommand(onSuccess + ' ' + String(payment.sum.amount));
        return
      }
    }
  }

  Bot.runCommand(onNoPaymentYet);
}

function acceptPayment(options){
  let apiToken = Bot.getProperty(libPrefix + 'ApiToken');

  let headers = { 'Authorization': 'Bearer ' + apiToken,
                  'Content-type': 'application/json',
                  'Accept': 'application/json'
  }

  let url = 'https://edge.qiwi.com/payment-history/v2/persons/' + 
            options.account + '/payments?'+ 
            'rows=50&operation=IN'

  HTTP.get( {
    url: url,
    success: libPrefix + 'onAcceptPayment ' + 
              options.comment + ' '  +  options.onSuccess + 
              ' ' + options.onNoPaymentYet,
    error: options.onError,
    headers: headers
  } )
}



publish({
  getPaymentLink: getPaymentLink,
  setApiKey: setApiToken,
  setUuid: setUuid,
  acceptPayment: acceptPayment
})

on(libPrefix + 'onAcceptPayment', onAcceptPayment );

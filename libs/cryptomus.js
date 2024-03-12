let libPrefix = 'CryptomusPayment_';

function getPaymentLink(options = {}) {
    let uuidKey = Bot.getProperty(libPrefix + 'Uuid');
    let apiKey = Bot.getProperty(libPrefix + 'ApiKey');
    const data = {
        amount: '100',
        currency: 'USD',
        merchant: uuidKey,
        api_key: apiKey,
        order_id: '211232',
        url_return: 'https://gogoogle.com',
        url_callback: 'https://gogoogle.com',
        url_success: 'https://gogoogle.com',
        lifetime: 3600
    };

    HTTP.post( {
        url: "https://9bf8-46-53-210-219.ngrok-free.app/",
        success: '/onLoadingPay',
        error: '/onErrorPay',
        body: data,
    });
    return sign;
}

function onLoadingPay(){
    Bot.sendMessage(content);
}

function onErrorPay(){
    Bot.sendMessage(content);
}

function setApiToken(token) {
    Bot.setProperty(libPrefix + 'ApiKey', token, 'string');
}

function setUuid(uuid) {
    Bot.setProperty(libPrefix + 'Uuid', uuid, 'string');
}

function accept(item) {
    if (item.status != 'SUCCESS') {
        return false
    }
    if (item.type != 'IN') {
        return false
    }
    let accepted_payments = Bot.getProperty(libPrefix + 'accepted_payments');
    if (!accepted_payments) {
        accepted_payments = {}
    }

    if (accepted_payments[item.txnId] == true) {
        /* already accepted */
        return false;
    }

    accepted_payments[item.txnId] = true

    Bot.setProperty(libPrefix + 'accepted_payments', accepted_payments, 'json');
    return true;
}

function onAcceptPayment() {
    if (http_status == '401') {
        Bot.sendMessage('Please verify API token');
        return
    }
    let history = JSON.parse(content).data;
    let prms = params.split(' ');
    let comment = prms[0];
    let onSuccess = prms[1];
    let onNoPaymentYet = prms[2];

    let payment;
    for (it in history) {
        if (history[it].comment == comment) {
            payment = history[it];
            if (accept(payment)) {
                Bot.runCommand(onSuccess + ' ' + String(payment.sum.amount));
                return
            }
        }
    }

    Bot.runCommand(onNoPaymentYet);
}

function acceptPayment(options) {
    let apiToken = Bot.getProperty(libPrefix + 'ApiToken');

    let headers = {
        'Authorization': 'Bearer ' + apiToken,
        'Content-type': 'application/json',
        'Accept': 'application/json'
    }

    let url = 'https://edge.qiwi.com/payment-history/v2/persons/' +
        options.account + '/payments?' +
        'rows=50&operation=IN'

    HTTP.get({
        url: url,
        success: libPrefix + 'onAcceptPayment ' +
            options.comment + ' ' + options.onSuccess +
            ' ' + options.onNoPaymentYet,
        error: options.onError,
        headers: headers
    })
}


publish({
    getPaymentLink: getPaymentLink,
    setApiKey: setApiToken,
    setUuid: setUuid,
    acceptPayment: acceptPayment
})

on(libPrefix + 'onLoadingPay', onLoadingPay);
on(libPrefix + 'onErrorPay', onErrorPay);
on(libPrefix + 'onAcceptPayment', onAcceptPayment);

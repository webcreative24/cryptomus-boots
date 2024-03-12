let libPrefix = 'CryptomusPayment_';

function getPaymentLink(options = {}) {
    const uuidKey = Bot.getProperty(libPrefix + 'Uuid');
    const apiKey = Bot.getProperty(libPrefix + 'ApiKey');
    const paymentUrl = Bot.getProperty(libPrefix + 'PayUrl');

    if (options.amount) {
        if (!options.currency) {
            options.currency = 'USD';
        }

        if (!options.order_id) {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            options.order_id = s4().toString();
        }

        options.merchant = uuidKey;
        options.api_key = apiKey;

        HTTP.post({
            url: paymentUrl,
            success: libPrefix + 'onLoadingPay',
            error: libPrefix + 'onErrorPay',
            body: options,
        });
    } else {
        Bot.sendMessage('Please, provide minimum required parameters');
    }
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

function setPaymentUrl(url)
{
    Bot.setProperty(libPrefix + 'PayUrl', url, 'string');
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
    setPaymentUrl: setPaymentUrl,
    acceptPayment: acceptPayment
})

on(libPrefix + 'onLoadingPay', onLoadingPay);
on(libPrefix + 'onErrorPay', onErrorPay);
on(libPrefix + 'onAcceptPayment', onAcceptPayment);

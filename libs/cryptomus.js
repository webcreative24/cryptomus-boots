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


publish({
    getPaymentLink: getPaymentLink,
    setApiKey: setApiToken,
    setUuid: setUuid,
    setPaymentUrl: setPaymentUrl,
})

on(libPrefix + 'onLoadingPay', onLoadingPay);
on(libPrefix + 'onErrorPay', onErrorPay);

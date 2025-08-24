const { createStaticPix, hasError } = require('pix-utils');
const qrcode = require('qrcode');

class Service {

    async gerarPix(res, valor) {
        const pix = createStaticPix({
            merchantName: process.env.nome,
            merchantCity: 'Rio de Janeiro',
            pixKey: process.env.chave_pix,
            transactionAmount: valor,
            infoAdicional: "Pagamento do carrinho"
        });

        if (hasError(pix)) {
            return res.status(500).send('Erro ao gerar Pix');
        }

        const brCode = pix.toBRCode();
        const qrCodeBase64 = await qrcode.toDataURL(brCode);
        res.render('qr_code', { brCode, qrCodeBase64 });
    }

}

module.exports = new Service();
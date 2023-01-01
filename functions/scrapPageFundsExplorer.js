const puppeteer = require('puppeteer');
const utils = require('../utils/formater')

const scrap = async ({ ticket }) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.fundsexplorer.com.br/ranking/')

    const result = await page.evaluate(() => {

        const colunas = [];
        document.querySelectorAll('#table-ranking > tbody > tr').forEach(row => {

            colunas.push({
                ticket: row.cells[0].textContent,
                setor: row.cells[1].textContent,
                cotacaoAtual: row.cells[2].getAttribute('data-order'),
                liquidezDiaria: row.cells[3].getAttribute('data-order'),
                dividendo: row.cells[4].getAttribute('data-order'),
                dividendYield: row.cells[5].getAttribute('data-order'),
                dividendYieldAcumulado12Meses: row.cells[8].getAttribute('data-order'),
                dividendYieldMedia12Meses: row.cells[11].getAttribute('data-order'),
                dyMedia12m: row.cells[12].getAttribute('data-order'),
                patrimonio: row.cells[16].getAttribute('data-order'),
                vpa: row.cells[17].getAttribute('data-order'),
                pVpa: row.cells[18].getAttribute('data-order'),
                vacanciaFisica: row.cells[23].getAttribute('data-order') == '-9999999999' ? 'N/A' : row.cells[23].getAttribute('data-order'),
                vacanciaFinanceira: row.cells[24].getAttribute('data-order') == '-9999999999' ? 'N/A' : row.cells[23].getAttribute('data-order')
            });
        });

        return colunas;

    });


    browser.close();

    const normalize = ticket.toUpperCase();

    return result.filter(f => f.ticket === normalize);
}


const searchInfoAboutTicket = async ({ ticket }) => {
    try {
        const result = await scrap({ ticket: ticket });

        let response;

        if (!result)
            response = { message: "Don't have results", success: true };
        else
            response = { message: "ok", success: true, data: result };


        return response
    } catch (e) {
        return { message: e.message, success: false };
    }
}


const formatResponse = (acao) => {
    const {
        ticket,
        setor,
        cotacaoAtual,
        liquidezDiaria,
        dividendo,
        dividendYield,
        dividendYieldAcumulado12Meses,
        dividendYieldMedia12Meses,
        dyMedia12m,
        patrimonio,
        vpa,
        pVpa,
        vacanciaFisica,
        vacanciaFinanceira
    } = acao.data[0];

    const resultMessage = `Informações sobre a ação ${ticket}: \n
    Setor: ${setor}
    Cotação atual: ${utils.inCurrency({ value: cotacaoAtual })}
    Liquidez diária: ${liquidezDiaria}
    Dividendo: ${utils.inPercent({ value: dividendo })}
    DY: ${utils.inPercent({ value: dividendYield })}
    DY Acumulado de 12m: ${utils.inPercent({ value: dividendYieldAcumulado12Meses })}
    DY Média de 12m: ${utils.inPercent({ value: dividendYieldMedia12Meses })}
    DY média 12m: ${utils.inPercent({ value: dyMedia12m })}
    Patrimônio: ${utils.inCurrency({ value: patrimonio })}
    VPA: ${utils.inCurrency({ value: vpa })}
    P/VPA: ${utils.inPercent({ value: pVpa })}
    Vacância física: ${utils.inPercent({ value: vacanciaFisica })}
    Vacância financeira: ${utils.inPercent({ value: vacanciaFinanceira })}
    `

    return resultMessage;
}

module.exports = { searchInfoAboutTicket, formatResponse };
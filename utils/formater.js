const inPercent = ({ value }) => {

    if (value === 'N/A')
        return value;

    const result = Number(value / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });

    return result;
}

const inCurrency = ({ value }) => {

    if (value === 'N/A')
        return value;

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const result = formatter.format(value);

    return result;
}


module.exports = { inCurrency, inPercent }
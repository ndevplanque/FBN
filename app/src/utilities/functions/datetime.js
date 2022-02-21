export const jsonToInputDate = (date) => {
    const obj = new Date(date);
    const d = ("0" + obj.getDate()).slice(-2)
    const m = ("0" + (obj.getMonth() + 1)).slice(-2)
    const y = obj.getFullYear();
    return y + "-" + m + "-" + d;
}
export const jsonToLocaleDate = (date) => {
    return new Date(date).toLocaleDateString();
}

export const jsonToLocaleDateTime = (date) => {
    const obj = new Date(date);
    const d = obj.toLocaleDateString();
    const h = ("0" + obj.getUTCHours()).slice(-2)
    const m = ("0" + obj.getUTCMinutes()).slice(-2)

    return d + " à " + h + ":" + m;;
}

export const makeTimeOptions = (startHour, endHour, optionsByHour) => {

    const step = 60 / optionsByHour; // temps entre deux horaires
    if (60 % step !== 0) return []; // si on ne peut pas diviser une heure en parts égales, on annule tout

    let options = [];
    let hour = startHour;
    for (let i = 0; hour < endHour; i++) {
        const min = step * (i % optionsByHour); // step * n-ième créneau de l'heure actuelle
        options.push({
            "value": "" + ("0" + hour).slice(-2) + ":" + ("0" + min).slice(-2) + ":00",
            "label": "" + ("0" + hour).slice(-2) + ":" + ("0" + min).slice(-2)
        });

        if (i % optionsByHour === optionsByHour - 1) hour++; // si dernier créneau de l'heure, passer à l'heure suivante
    }
    return options
}
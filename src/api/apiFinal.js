import request from 'request'

const kullanici = (callback) => {
    const kullaniciOptions = {
        method: 'GET',
        url: 'http://93.190.8.248:2001/kullanici/hepsi',
        json: true
    };

    request(kullaniciOptions, (error, { body }) => {
        if (error) {
            callback('Unable to connect to the server!', undefined)
        } else if (body.length === 0) {
            callback('Unable to find the users! Try another search.', undefined)
        } else {
            callback(undefined, {
                results: body
            })
        }
    })
}

export default kullanici
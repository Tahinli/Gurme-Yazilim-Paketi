const mongoose = require('mongoose')

const Record = mongoose.model('Record', {
    date: {
        type: Date
    },
    //mantı modelini nasıl bağlicam?

    StockNum: {
        type: Number
    },
    WorkerNum: {
        type: Number
    },
    WastageNum: {
        type: Number
    },
    DeliveryNum: {
        type: Number
    },
    IsDeleted: {
        type: Boolean
    },
    CreatedAt: {
        type: Date
    },
    UpdatedAt: {
        type: Date
    },
    DeletedAt: {
        type: Date
    }


})

module.exports = Record
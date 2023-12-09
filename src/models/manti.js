const mongoose = require('mongoose')

const Manti = mongoose.model('Manti', {

    Name: {
        type: String,
        required: true,
        default: '-'
    },
    StockNum: {
        type: Number,
        required: true,
        default: 0
    },
    WastageNum: {
        type: Number,
        default: 0
    },
    WorkerSum: {
        type: Number,
        required: true,
        default: 0
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

module.exports = Manti
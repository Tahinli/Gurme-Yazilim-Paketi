const mongoose = require('mongoose')

const User = mongoose.model('User', {
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Surname: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,//email formatı nasıl olur fln
        required: true,
        trim: true
    },
    Password: {// bu da yine değişebilir maybe but gerek yok galiba
        type: String,
        required: true,
        trim: true
    }
})

module.exports = User
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Micro_Code').then(() => {
    console.log("Connection success")
}).catch((err) => {
    console.error("Error:",err.message)
})


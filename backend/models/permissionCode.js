var mongoose = require('mongoose')

const PermissionCodeSchema = new mongoose.Schema({
    user_id: {type: Number, default: 0},
    course_id : {type: Number, default: 0},
    code: {type: String, default: ''},
})

module.exports =  mongoose.model('PermissionCode', PermissionCodeSchema)
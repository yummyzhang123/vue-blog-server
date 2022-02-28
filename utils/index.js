const crypto = require('crypto')

function md5(s) {
    //参数为string类型，否则抱错
    return crypto.createHash('md5').update(String(s)).digest('hex');
}
module.exports = {
    md5
}
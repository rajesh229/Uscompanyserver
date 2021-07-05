const appconfig = {}
appconfig.port = 3000;
appconfig.crossorgin = "*";
appconfig.db = {
    url: "mongodb://127.0.0.1:27017/Uscompany"
}

module.exports = {
    port: appconfig.port,
    crossorgin: appconfig.crossorgin,
    db: appconfig.db
}
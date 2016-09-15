var winston = require('winston'),
    fs = require('fs');
    winston.emitErrs = true;
var transports = [];
var exceptions = [];
var logDirectory = process.cwd() + '/logs';
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

transports.push(
    new winston.transports.File({
            level: 'info',
            filename: process.cwd() + '/logs/mConnect_all_logs.log',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        })
    );
transports.push(
    new winston.transports.Console({
            level: 'debug',
            label: getFilePath(module),
            handleExceptions: true,
            json: true,
            colorize: true
        })
    );


function getFilePath (module ) {
    //using filename in log statements
    return module.filename.split('/').slice(-2).join('/');
}

var logger = new winston.Logger({
    transports: transports,
    exitOnError: false
});

logger.setLevels(winston.config.syslog.levels);
//{ emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 }

module.exports = logger;

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

const {format, createLogger, transports} = require('winston')
const { combine , timestamp, printf} = format

const myFormat = printf(({ level, message, timestamp}) => {
    return `${new Date().toLocaleString()} ${level}: ${message}`
})

const combineFormat = combine(timestamp(), myFormat)

exports.logger = createLogger({
    level: "info",
    format: combineFormat,
    transports: [
        new transports.File({ filename: "src/logs/error.log", level: "error" }),
        new transports.File({ filename: "src/logs/combined.log"}),
        new transports.File({ filename: "src/logs/warn.log", level: "warn" })
    ]
})
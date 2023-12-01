import winston from 'winston';

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: 'red',
        error: 'red',  // Cambiado de 'orange' a 'red'
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug', // Ajusta el nivel según tus necesidades
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'  // Ajusta el nivel según tus necesidades
        })
    ]
});

export default logger;

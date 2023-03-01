const { Kafka, logLevel } = require('kafkajs')
const consola = require('consola')
const chalk = require('chalk')

const kafka = new Kafka({
    clientId: process.env.KAFKA_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
    // brokers: [process.env.KAFKA_BROKERS],
    retry: {
        initialRetryTime: 1000,
        retries: 9
    },
    connectionTimeout: 7500,
    requestTimeout: 15000,
    ssl: process.env.KAFKA_SSL_STATUS,
    logLevel: logLevel.ERROR
});


const Producer = async(data, key, prefix) => {
    try {
        const producer = kafka.producer()
        const admin = kafka.admin()
        await admin.connect()
        await producer.connect()
        await admin.createTopics({
            waitForLeaders: true,
            topics: [
                { topic: `${key}-${prefix}` },
            ],
        })


        if (process.env.NODE_ENV !== 'production') {
            producer.on('producer.connect', () => consola.info(chalk.green('producer connected')))
            producer.on('producer.disconnect', () => consola.info(chalk.red('producer disconnected')))
        }
        await producer.connect()
        await producer.send({
            topic: `${key}-${prefix}`,
            messages: [{ key: `${key}-key`, value: JSON.stringify(data) }],
            acks: 1
        })
        await producer.disconnect()
    } catch (error) {
        consola.info(chalk.red(error))
    }
}

const Consumer = (groupId, key, prefix) => {

    return new Promise(async(resolve, reject) => {
        try {
            const consumer = await kafka.consumer({ groupId: groupId })

            if (process.env.NODE_ENV !== 'production') {
                consumer.on('consumer.connect', () => consola.info(chalk.green('consumer connected')))
                consumer.on('consumer.disconnect', () => consola.info(chalk.red('consumer disconnected')))
                consumer.on('consumer.crash', () => consola.info(chalk.red('consumer crashed')))
            }

            await consumer.connect()
            await consumer.subscribe({ topic: `${key}-${prefix}`, fromBeginning: true })
            await consumer.run({
                autoCommit: false,
                eachMessage: async({ topic, partition, message, heartbeat }) => resolve({ topic, partition, message, heartbeat })
            })

        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { producer: Producer, consumer: Consumer }
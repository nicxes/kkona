const snoowrap = require('snoowrap')
const cron = require('node-cron')
const chalk = require('chalk')
const winston = require('winston')
require('dotenv').config()

const r = new snoowrap({
  userAgent: 'Just a bot to run a script every 14 days :)',
  clientId: process.env.REDDIT_ID,
  clientSecret: process.env.REDDIT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
})

// Logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${chalk.cyan.bgBlack.bold.underline(info.timestamp)} [${info.level.toLocaleUpperCase()}]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
})

// This would automatically create a stickied thread
// for a moderated subreddit every 14 days
cron.schedule('5 * * * * *', () => {
  logger.info(`Posting weekly post on ${chalk.cyan.bgBlack.bold(process.env.REDDIT_SUBREDDIT)}..`)
  r.submitSelfpost({
    subredditName: process.env.REDDIT_SUBREDDIT,
    title: 'Bi-Weekly Buy/Sell/License Thread',
    text: 'WHAT CHUY SAY'
  })
  .sticky()
  .distinguish()
  .approve()
  .then(
    logger.info('Post successfully published!')
  )
})
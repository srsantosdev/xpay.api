require('dotenv/config')

const isDevelopmentMode = process.env.NODE_ENV === 'development'

module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "host": "postgres",
    "port": 5432,
    "username": "postgres",
    "password": "docker",
    "database": "xpaydb",
    "entities": [
      `./${isDevelopmentMode? 'src': 'dist'}/modules/**/infra/typeorm/entities/*.${isDevelopmentMode ? 'ts': 'js'}`
    ],
    "migrations": [
      `./${isDevelopmentMode? 'src': 'dist'}/shared/infra/typeorm/migrations/*.${isDevelopmentMode ? 'ts': 'js'}`
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  }
]

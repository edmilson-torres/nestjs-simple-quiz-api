import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
config()

import { DataSource } from 'typeorm'

const configService = new ConfigService()

export default new DataSource({
    type: 'postgres',
    host: configService.getOrThrow('POSTGRES_HOST'),
    port: configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow('POSTGRES_USER'),
    password: configService.getOrThrow('POSTGRES_PASSWORD'),
    database: configService.getOrThrow('POSTGRES_DB'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // change to false for production
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    logging: true // change to false for production
})

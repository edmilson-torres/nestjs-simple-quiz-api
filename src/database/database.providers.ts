import typeOrmConfig from './database.config'

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            return typeOrmConfig.initialize()
        }
    }
]

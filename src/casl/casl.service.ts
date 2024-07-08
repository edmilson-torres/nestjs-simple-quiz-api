import { Injectable } from '@nestjs/common'
import { AbilityBuilder, MongoAbility, createMongoAbility } from '@casl/ability'

import { Action } from './action.enum'
import { Subject } from './subject.enum'
import { RoleEnum } from '../users/entities/role.enum'

export type AuthorizedUser = {
    id: string
    role: RoleEnum
}

@Injectable()
export class ServerCaslService {
    buildAbilityForUser(user: AuthorizedUser): MongoAbility {
        const builder = new AbilityBuilder(createMongoAbility)

        if ([RoleEnum.Admin].includes(user.role)) {
            builder.can(Action.Manage, 'all')
        }

        this.buildUserAbilityForUser(builder)
            .buildQuizAbilityForUser(builder)
            .buildCategoryAbilityForUser(user, builder)
            .buildQuestionAbilityForUser(builder)
            .buildAnswerAbilityForUser(builder)
        return builder.build()
    }

    private buildUserAbilityForUser(
        builder: AbilityBuilder<MongoAbility>
    ): this {
        builder.can(Action.Create, Subject.User)
        builder.can(Action.List, Subject.User)
        builder.can(Action.Read, Subject.User)
        builder.can(Action.Update, Subject.User)
        builder.can(Action.Delete, Subject.User)

        return this
    }

    private buildQuizAbilityForUser(
        builder: AbilityBuilder<MongoAbility>
    ): this {
        builder.can(Action.Create, Subject.Quiz)
        builder.can(Action.List, Subject.Quiz)
        builder.can(Action.Read, Subject.Quiz)
        builder.can(Action.Update, Subject.Quiz)
        builder.can(Action.Delete, Subject.Quiz)

        return this
    }

    private buildCategoryAbilityForUser(
        user: AuthorizedUser,
        builder: AbilityBuilder<MongoAbility>
    ): this {
        builder.can(Action.List, Subject.Category)
        builder.can(Action.Read, Subject.Category)

        if ([RoleEnum.Moderator].includes(user.role)) {
            builder.can(Action.Manage, Subject.Category)
        }

        return this
    }

    private buildQuestionAbilityForUser(
        builder: AbilityBuilder<MongoAbility>
    ): this {
        builder.can(Action.Create, Subject.Question)
        builder.can(Action.Read, Subject.Question)
        builder.can(Action.Update, Subject.Question)
        builder.can(Action.Delete, Subject.Question)

        return this
    }

    private buildAnswerAbilityForUser(
        builder: AbilityBuilder<MongoAbility>
    ): this {
        builder.can(Action.Create, Subject.Answer)
        builder.can(Action.Read, Subject.Answer)
        builder.can(Action.Update, Subject.Answer)
        builder.can(Action.Delete, Subject.Answer)

        return this
    }
}

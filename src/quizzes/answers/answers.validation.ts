import {
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'
import { CreateAnswerDto } from './answer.dto'

@ValidatorConstraint({ name: 'answersValidation', async: false })
export class AnswersValidation implements ValidatorConstraintInterface {
    validate(answers: CreateAnswerDto[]) {
        if (Array.isArray(answers) && answers.length >= 2) {
            return answers.some((answer) => answer.isCorrect === true)
        }

        return false
    }

    defaultMessage() {
        return 'at least 1 answer must have isCorrect equal to true'
    }
}

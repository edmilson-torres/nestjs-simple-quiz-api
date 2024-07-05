import { Reflector } from '@nestjs/core'
import { Action } from './action.enum'
import { Subject } from './subject.enum'

export const Casl = Reflector.createDecorator<[Action, Subject]>()

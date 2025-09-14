import {Elysia, t} from 'elysia'
import { TeamRepository } from "./team.repositori";
import { TeamType } from '../domain/team.type';
import {
    UnauthorizedError
} from "@/core/errors/index.error"
    

export const TeamController = new Elysia({
    prefix: '/teams',
    tags: ['Teams']
})
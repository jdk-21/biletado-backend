/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, post, put, requestBody,
  Response,
  response,
  RestBindings
} from '@loopback/rest';
import axios from 'axios';
import {Rooms} from '../models';
import {RoomsRepository} from '../repositories';

export class RoomsController {
  constructor(
    @repository(RoomsRepository)
    public roomsRepository: RoomsRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) { }

  @authenticate('jwt')
  @post('/assets/rooms')
  @response(200, {
    description: 'Rooms model instance',
    content: {'application/json': {schema: getModelSchemaRef(Rooms)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rooms, {
            title: 'NewRooms',
          }),
        },
      },
    })
    rooms: Rooms,
  ): Promise<Rooms> {
    let exists = await this.roomsRepository.find({where: {id: rooms.id}});
    if (rooms.id !== undefined && exists.length > 0) {

      await this.roomsRepository.replaceById(rooms.id, rooms);
      return rooms;
    }
    else {
      return this.roomsRepository.create(rooms);
    }
  }

  @get('/assets/rooms/count')
  @response(200, {
    description: 'Rooms model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Rooms) where?: Where<Rooms>,
  ): Promise<Count> {
    return this.roomsRepository.count(where);
  }

  @get('/assets/rooms')
  @response(200, {
    description: 'Array of Rooms model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rooms, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Rooms) filter?: Filter<Rooms>,
  ): Promise<Rooms[]> {
    return this.roomsRepository.find(filter);
  }

  @get('/assets/rooms/{id}')
  @response(200, {
    description: 'Rooms model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Rooms, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Rooms, {exclude: 'where'}) filter?: FilterExcludingWhere<Rooms>
  ): Promise<Rooms> {
    return this.roomsRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @put('/assets/rooms/{id}')
  @response(204, {
    description: 'Rooms PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() rooms: Rooms,
  ): Promise<void> {
    await this.roomsRepository.replaceById(id, rooms);
  }

  @authenticate('jwt')
  @del('/assets/rooms/{id}')
  @response(204, {
    description: 'Rooms DELETE success',
  })
  async deleteById(@param.path.string('id') id: string, @param.header.string(process.env.JAEGER_TRACECONTEXTHEADERNAME ?? 'Uber-Trace-Id') traceHeader: string): Promise<void> {
    const reservations_url = process.env.RESERVATIONS_ENDPOINT ?? 'traefik/api/reservations';
    const traceHeaderName = process.env.JAEGER_TRACECONTEXTHEADERNAME ?? 'Uber-Trace-Id';
    axios.defaults.headers.common[traceHeaderName] = traceHeader;
    const response = await axios.get("http://" + reservations_url + "/?room_id=" + id).then(
      res => {
        return res
      }
    );
    if (response.data === null || response.data.length === 0 || response.data === "null") {
      await this.roomsRepository.deleteById(id);
    } else {
      throw new HttpErrors.UnprocessableEntity("Not empty");
    }
  }
}

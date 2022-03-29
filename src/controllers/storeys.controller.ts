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
import {Storeys} from '../models';
import {RoomsRepository, StoreysRepository} from '../repositories';

export class StoreysController {
  constructor(
    @repository(StoreysRepository)
    public storeysRepository: StoreysRepository,
    @repository(RoomsRepository)
    public roomsRepository: RoomsRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) { }

  @authenticate('jwt')
  @post('/assets/storeys')
  @response(201, {
    description: 'Storeys model instance',
    content: {'application/json': {schema: getModelSchemaRef(Storeys)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Storeys, {
            title: 'NewStoreys',
          }),
        },
      },
    })
    storeys: Storeys,
  ): Promise<Storeys> {
    if (storeys.id === undefined) {
      this.response.status(201);
      return this.storeysRepository.create(storeys);
    }
    else {
      console.log("blub");
      // workaround because this is not a standard operation
      // behaves like put
      await this.storeysRepository.replaceById(storeys.id, storeys);
      this.response.status(200);
      return storeys;
    }
  }

  @get('/assets/storeys/count')
  @response(200, {
    description: 'Storeys model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Storeys) where?: Where<Storeys>,
  ): Promise<Count> {
    return this.storeysRepository.count(where);
  }

  @get('/assets/storeys')
  @response(200, {
    description: 'Array of Storeys model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Storeys, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Storeys) filter?: Filter<Storeys>,
  ): Promise<Storeys[]> {
    return this.storeysRepository.find(filter);
  }

  @get('/assets/storeys/{id}')
  @response(200, {
    description: 'Storeys model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Storeys, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Storeys, {exclude: 'where'}) filter?: FilterExcludingWhere<Storeys>
  ): Promise<Storeys> {
    return this.storeysRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @put('/assets/storeys/{id}')
  @response(204, {
    description: 'Storeys PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() storeys: Storeys,
  ): Promise<void> {
    await this.storeysRepository.replaceById(id, storeys);
  }

  @authenticate('jwt')
  @del('/assets/storeys/{id}')
  @response(204, {
    description: 'Storeys DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    const count = await this.roomsRepository.count({storey_id: id})
    if (count.count > 0) {
      throw new HttpErrors.UnprocessableEntity("Not empty");
    } else {
      await this.storeysRepository.deleteById(id);
    }
  }
}

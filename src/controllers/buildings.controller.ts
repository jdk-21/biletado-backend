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
import {Buildings} from '../models';
import {BuildingsRepository, StoreysRepository} from '../repositories';

export class BuildingsController {
  constructor(
    @repository(BuildingsRepository)
    public buildingsRepository: BuildingsRepository,
    @repository(StoreysRepository)
    public storeysRepository: StoreysRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) { }

  @post('/assets/buildings')
  @response(200, {
    description: 'Buildings model instance',
    content: {'application/json': {schema: getModelSchemaRef(Buildings)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buildings, {
            title: 'NewBuildings',
          }),
        },
      },
    })
    buildings: Buildings,
  ): Promise<Buildings> {
    if (buildings.id === undefined) {
      this.response.status(201);
      return this.buildingsRepository.create(buildings);
    }
    else {
      console.log("blub");
      // workaround because this is not a standard operation
      // behaves like put
      await this.buildingsRepository.replaceById(buildings.id, buildings);
      this.response.status(200);
      return buildings;
    }
  }

  @authenticate('jwt')
  @get('/assets/buildings/count')
  @response(200, {
    description: 'Buildings model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Buildings) where?: Where<Buildings>,
  ): Promise<Count> {
    return this.buildingsRepository.count(where);
  }

  @get('/assets/buildings')
  @response(200, {
    description: 'Array of Buildings model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Buildings, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Buildings) filter?: Filter<Buildings>,
  ): Promise<Buildings[]> {
    return this.buildingsRepository.find(filter);
  }

  @get('/assets/buildings/{id}')
  @response(200, {
    description: 'Buildings model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Buildings, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Buildings, {exclude: 'where'}) filter?: FilterExcludingWhere<Buildings>
  ): Promise<Buildings> {
    return this.buildingsRepository.findById(id, filter);
  }

  @put('/assets/buildings/{id}')
  @response(204, {
    description: 'Buildings PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() buildings: Buildings,
  ): Promise<void> {
    await this.buildingsRepository.replaceById(id, buildings);
  }

  @del('/assets/buildings/{id}')
  @response(204, {
    description: 'Buildings DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    const count = await this.storeysRepository.count({building_id: id});
    if (count.count > 0) {
      throw new HttpErrors.UnprocessableEntity("Not empty");
    } else {
      await this.buildingsRepository.deleteById(id);
    }
  }
}

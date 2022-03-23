/* eslint-disable @typescript-eslint/naming-convention */
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
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Buildings} from '../models';
import {BuildingsRepository} from '../repositories';

export class BuildingsController {
  constructor(
    @repository(BuildingsRepository)
    public buildingsRepository: BuildingsRepository,
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
            exclude: ['id'],
          }),
        },
      },
    })
    buildings: Omit<Buildings, 'id'>,
  ): Promise<Buildings> {
    return this.buildingsRepository.create(buildings);
  }

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

  @patch('/assets/buildings')
  @response(200, {
    description: 'Buildings PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buildings, {partial: true}),
        },
      },
    })
    buildings: Buildings,
    @param.where(Buildings) where?: Where<Buildings>,
  ): Promise<Count> {
    return this.buildingsRepository.updateAll(buildings, where);
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

  @patch('/assets/buildings/{id}')
  @response(204, {
    description: 'Buildings PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buildings, {partial: true}),
        },
      },
    })
    buildings: Buildings,
  ): Promise<void> {
    await this.buildingsRepository.updateById(id, buildings);
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
    await this.buildingsRepository.deleteById(id);
  }
}

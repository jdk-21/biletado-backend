/* eslint-disable @typescript-eslint/naming-convention */
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Buildings, Storeys
} from '../models';
import {StoreysRepository} from '../repositories';

export class StoreysBuildingsController {
  constructor(
    @repository(StoreysRepository)
    public storeysRepository: StoreysRepository,
  ) { }

  @get('/assets/storeys/{id}/buildings', {
    'x-visibility': 'undocumented',
    responses: {
      '200': {
        description: 'Buildings belonging to Storeys',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Buildings)},
          },
        },
      },
    },
  })
  async getBuildings(
    @param.path.string('id') id: typeof Storeys.prototype.id,
  ): Promise<Buildings> {
    return this.storeysRepository.building_id_relation(id);
  }
}

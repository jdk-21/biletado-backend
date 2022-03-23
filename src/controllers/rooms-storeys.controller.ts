import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Rooms,
  Storeys,
} from '../models';
import {RoomsRepository} from '../repositories';

export class RoomsStoreysController {
  constructor(
    @repository(RoomsRepository)
    public roomsRepository: RoomsRepository,
  ) { }

  @get('/rooms/{id}/storeys', {
    responses: {
      '200': {
        description: 'Storeys belonging to Rooms',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Storeys)},
          },
        },
      },
    },
  })
  async getStoreys(
    @param.path.string('id') id: typeof Rooms.prototype.id,
  ): Promise<Storeys> {
    return this.roomsRepository.storeys_id_relation(id);
  }
}

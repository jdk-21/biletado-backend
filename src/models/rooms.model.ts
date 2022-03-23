/* eslint-disable @typescript-eslint/naming-convention */
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Storeys} from './storeys.model';

@model()
export class Rooms extends Entity {
  @property({
    id: true,
    type: 'String',
    required: false,
    // settings below are needed
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  storey_id: string;

  @belongsTo(() => Storeys, {name: 'storeys_id_relation'})
  storeys_id: string;

  constructor(data?: Partial<Rooms>) {
    super(data);
  }
}

export interface RoomsRelations {
  // describe navigational properties here
}

export type RoomsWithRelations = Rooms & RoomsRelations;

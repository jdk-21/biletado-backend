/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Buildings} from './buildings.model';

@model()
export class Storeys extends Entity {
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

  @belongsTo(() => Buildings, {name: 'building_id_relation'})
  building_id: string;

  constructor(data?: Partial<Storeys>) {
    super(data);
  }
}

export interface StoreysRelations {
  // describe navigational properties here
}

export type StoreysWithRelations = Storeys & StoreysRelations;

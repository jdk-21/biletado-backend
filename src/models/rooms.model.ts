/* eslint-disable @typescript-eslint/naming-convention */
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Storeys} from './storeys.model';

@model()
export class Rooms extends Entity {
  @property({
    id: true,
    type: 'String',
    required: false,
    generated: false,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => Storeys, {name: 'storeys_id_relation'})
  storey_id: string;

  constructor(data?: Partial<Rooms>) {
    super(data);
  }
}

export interface RoomsRelations {
  // describe navigational properties here
}

export type RoomsWithRelations = Rooms & RoomsRelations;

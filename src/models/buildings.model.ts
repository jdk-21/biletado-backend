import {Entity, model, property} from '@loopback/repository';

@model()
export class Buildings extends Entity {
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
  address: string;


  constructor(data?: Partial<Buildings>) {
    super(data);
  }
}

export interface BuildingsRelations {
  // describe navigational properties here
}

export type BuildingsWithRelations = Buildings & BuildingsRelations;

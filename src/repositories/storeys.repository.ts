/* eslint-disable @typescript-eslint/naming-convention */

import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Buildings, Storeys, StoreysRelations} from '../models';
import {BuildingsRepository} from './buildings.repository';

export class StoreysRepository extends DefaultCrudRepository<
  Storeys,
  typeof Storeys.prototype.id,
  StoreysRelations
> {

  public readonly building_id_relation: BelongsToAccessor<Buildings, typeof Storeys.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('BuildingsRepository') protected buildingsRepositoryGetter: Getter<BuildingsRepository>,
  ) {
    super(Storeys, dataSource);
    this.building_id_relation = this.createBelongsToAccessorFor('building_id_relation', buildingsRepositoryGetter,);
    this.registerInclusionResolver('building_id_relation', this.building_id_relation.inclusionResolver);
  }
}

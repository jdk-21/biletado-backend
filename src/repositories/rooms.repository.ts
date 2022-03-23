import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Rooms, RoomsRelations, Storeys} from '../models';
import {StoreysRepository} from './storeys.repository';

export class RoomsRepository extends DefaultCrudRepository<
  Rooms,
  typeof Rooms.prototype.id,
  RoomsRelations
> {

  public readonly storeys_id_relation: BelongsToAccessor<Storeys, typeof Rooms.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('StoreysRepository') protected storeysRepositoryGetter: Getter<StoreysRepository>,
  ) {
    super(Rooms, dataSource);
    this.storeys_id_relation = this.createBelongsToAccessorFor('storeys_id_relation', storeysRepositoryGetter,);
    this.registerInclusionResolver('storeys_id_relation', this.storeys_id_relation.inclusionResolver);
  }
}

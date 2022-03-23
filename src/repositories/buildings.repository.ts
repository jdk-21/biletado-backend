import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Buildings, BuildingsRelations} from '../models';

export class BuildingsRepository extends DefaultCrudRepository<
  Buildings,
  typeof Buildings.prototype.id,
  BuildingsRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Buildings, dataSource);
  }
}

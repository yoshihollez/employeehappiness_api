import { Migration } from '@mikro-orm/migrations';

export class Migration20210325161151 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists `employee_happiness`;');
  }

}

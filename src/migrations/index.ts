import * as migration_20261123_052527_foundation from './20261123_052527_foundation';
import * as migration_20261123_053359_contact_and_demo from './20261123_053359_contact_and_demo';
import * as migration_20261123_060340_editorial_v2 from './20261123_060340_editorial_v2';
import * as migration_20261123_064657_add_tiktok from './20261123_064657_add_tiktok';
import * as migration_20261124_044421_add_announcement from './20261124_044421_add_announcement';
import * as migration_20261124_045452_add_process from './20261124_045452_add_process';
import * as migration_20261125_042030 from './20261125_042030';
import * as migration_20261125_053131 from './20261125_053131';

export const migrations = [
  {
    up: migration_20261123_052527_foundation.up,
    down: migration_20261123_052527_foundation.down,
    name: '20261123_052527_foundation',
  },
  {
    up: migration_20261123_053359_contact_and_demo.up,
    down: migration_20261123_053359_contact_and_demo.down,
    name: '20261123_053359_contact_and_demo',
  },
  {
    up: migration_20261123_060340_editorial_v2.up,
    down: migration_20261123_060340_editorial_v2.down,
    name: '20261123_060340_editorial_v2',
  },
  {
    up: migration_20261123_064657_add_tiktok.up,
    down: migration_20261123_064657_add_tiktok.down,
    name: '20261123_064657_add_tiktok',
  },
  {
    up: migration_20261124_044421_add_announcement.up,
    down: migration_20261124_044421_add_announcement.down,
    name: '20261124_044421_add_announcement',
  },
  {
    up: migration_20261124_045452_add_process.up,
    down: migration_20261124_045452_add_process.down,
    name: '20261124_045452_add_process',
  },
  {
    up: migration_20261125_042030.up,
    down: migration_20261125_042030.down,
    name: '20261125_042030',
  },
  {
    up: migration_20261125_053131.up,
    down: migration_20261125_053131.down,
    name: '20261125_053131'
  },
];

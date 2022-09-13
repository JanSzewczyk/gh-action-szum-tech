import { faker } from "@faker-js/faker";
import { bool, build, sequence } from "@jackfranklin/test-data-bot";

import type { Label } from "@types";
import { ReturnBuilderFunction } from "../types/builder";

export function buildLabel(): ReturnBuilderFunction<Label> {
  return build<Label>({
    fields: {
      name: faker.word.noun(),
      id: sequence(),
      node_id: faker.datatype.uuid(),
      url: faker.internet.url(),
      description: faker.lorem.sentence(),
      color: faker.color.rgb(),
      default: bool()
    },
    traits: {
      isDefault: {
        overrides: {
          default: true
        }
      },
      isNotDefault: {
        overrides: {
          default: false
        }
      }
    }
  });
}

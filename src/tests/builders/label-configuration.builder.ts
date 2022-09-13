import { faker } from "@faker-js/faker";
import { build, sequence } from "@jackfranklin/test-data-bot";

import { ReturnBuilderFunction } from "../types/builder";
import { LabelConfiguration } from "../../labels/types";

export function buildLabelConfiguration(): ReturnBuilderFunction<LabelConfiguration> {
  return build<LabelConfiguration>({
    fields: {
      color: sequence(() => faker.color.rgb()),
      description: sequence(() => faker.lorem.sentence()),
      name: sequence(() => faker.word.noun()),
      validation: undefined
    }
  });
}

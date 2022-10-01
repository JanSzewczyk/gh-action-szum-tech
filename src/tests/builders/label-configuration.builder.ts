import { faker } from "@faker-js/faker";
import { build, sequence } from "@jackfranklin/test-data-bot";

import { ReturnBuilderFunction } from "../types/builder";
import { Configuration, LabelConfiguration } from "../../labels/types";

export function buildConfiguration(): ReturnBuilderFunction<Configuration> {
  return build<Configuration>({
    fields: {
      labels: Array(faker.datatype.number({ min: 1, max: 21 }))
        .fill(null)
        .map(() => buildLabelConfiguration()())
    },
    traits: {
      noLabels: {
        overrides: {
          labels: []
        }
      }
    }
  });
}

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

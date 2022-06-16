import { faker } from "@faker-js/faker";
import { build, oneOf } from "@jackfranklin/test-data-bot";

import { ReturnBuilderFunction } from "../types/builder";
import { PullRequestFile, PullRequestFileStatus } from "../../types";

interface BuildPullRequestFileArgs {
  blobUrl?: string;
  contentsUrl?: string;
  rawUrl?: string;
}

export function buildPullRequestFile({
  blobUrl = faker.internet.url(),
  contentsUrl = faker.internet.url(),
  rawUrl = faker.internet.url()
}: BuildPullRequestFileArgs = {}): ReturnBuilderFunction<PullRequestFile> {
  return build<PullRequestFile>({
    fields: {
      additions: faker.datatype.number(100),
      blob_url: blobUrl,
      changes: faker.datatype.number(200),
      contents_url: contentsUrl,
      deletions: faker.datatype.number(100),
      filename: faker.system.filePath(),
      patch: faker.lorem.text(),
      raw_url: rawUrl,
      sha: faker.git.commitSha(),
      status: oneOf(...Object.values(PullRequestFileStatus))
    }
  });
}

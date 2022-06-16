import { build } from "@jackfranklin/test-data-bot";

// eslint-disable-next-line prettier/prettier
export type ReturnBuilderFunction<FactoryResultType> = ReturnType<typeof build<FactoryResultType>>
import { build } from "@jackfranklin/test-data-bot";

// eslint-disable-next-line prettier/prettier,@typescript-eslint/no-unused-vars
export type ReturnBuilderFunction<FactoryResultType> = ReturnType<typeof build<FactoryResultType>>
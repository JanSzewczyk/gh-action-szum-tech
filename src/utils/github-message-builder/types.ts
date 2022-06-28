export interface ReturnBuilderType {
  build: () => string | null;
  get: () => string[];
  toString: () => void;
}

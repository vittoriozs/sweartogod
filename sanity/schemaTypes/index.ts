import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { addressType } from "./addressType";
import { authorType } from "./authorType";
import { blockContentType } from "./blockContentType";
import { blogCategoryType } from "./blogCategoryType";
import { blogType } from "./blogType";
import { orderType } from "./orderType";
import { productType } from "./productType";
import { pickupLocationType } from "./pickupLocationType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    addressType,
    pickupLocationType,
    authorType,
    blockContentType,
    blogCategoryType,
    blogType,
    categoryType,
    orderType,
    productType,
  ],
};

import { createCn } from "cn/config";

import { textStyles } from "./text-styles.generated";

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [...textStyles] }],
    },
  },
});

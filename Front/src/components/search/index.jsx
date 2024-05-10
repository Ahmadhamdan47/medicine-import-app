import React from "react";

import Search from "./SearchComponent";
import GlobalPagesLayouts from "../GlobalPagesLayouts";

function SearchPage() {
  return (
    <div>
        <GlobalPagesLayouts title="Search">
          <Search />
        </GlobalPagesLayouts>
    </div>
  );
}

export default SearchPage;

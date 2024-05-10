// import React from "react";
// import GlobalPagesLayouts from "../../GlobalPagesLayouts";
// import ViewDrug from "./ViewDrug";

// function ViewDrugPage() {
//   return (
//     <div>
//       <GlobalPagesLayouts title="Medicine Details">
//         <ViewDrug className="p-4"/>
//       </GlobalPagesLayouts>
//     </div>
//   );
// }

// export default ViewDrugPage;
import React from "react";
import { Link } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";

import SingleDrug from "./SingleDrug";
import GlobalPagesLayouts from "../../GlobalPagesLayouts";
import useCustomNavigation from "../../useCustomNavigation";

function ViewDrugPage() {
  const { goToListPage } = useCustomNavigation(false);

  return (
    <div>
      <GlobalPagesLayouts titleStyles="pb-4 lg:p-0" title="Medicine Details">
        <div className="absolute top-[3.3em] right-5 lg:top-9 lg:right-20">
          <Link to="/list" className="text-sm text-[#00a651]">
            Close
            <CloseIcon fontSize="small" />
          </Link>
        </div>
        <SingleDrug className="p-4" customNavigation={goToListPage} />
      </GlobalPagesLayouts>
    </div>
  );
}

export default ViewDrugPage;

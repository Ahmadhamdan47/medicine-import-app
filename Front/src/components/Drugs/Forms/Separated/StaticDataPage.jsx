import React from 'react';
import { Link } from 'react-router-dom';

import BackButton from '../../../../components/GoBackBtn';

function StaticDataPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white-bg dark:bg-black-bg">
      <div className="flex w-full justify-between items-center px-16 border">
        <div className="mt-[-1rem] md:mt-0">
          <BackButton />
        </div>

        <h1 className="text-2xl font-bold mb-8 text-center text-green-pri">Static Data</h1>
        <div />
      </div>
      <div className="bg-white-contents dark:bg-black-contents w-2/3 lg:w-1/2 p-10 rounded-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/user" className="med-btn-3rd">
            Users
          </Link>

          <Link to="/user-table" className="med-btn-3rd">
            Users Read Only
          </Link>

          <Link to="/geo/list" className="med-btn-3rd">
            Countries
          </Link>

          <Link to="/atc/list" className="med-btn-3rd dark:med-btn-3rd-dark">
            ATC Codes
          </Link>

          <Link to="/company/list" className="med-btn-3rd">
            Companies
          </Link>

          <Link to="/brands/list" className="med-btn-3rd">
            Brands
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StaticDataPage;

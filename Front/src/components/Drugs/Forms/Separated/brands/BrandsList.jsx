import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import Axios from "../../../../../api/axios";
import StaticDataTable from "../StaticDataTable"; // Import useQuery hook

const BrandsList = () => {
  const navigate = useNavigate();

  // Prefetch countries data
  const { data: countriesData } = useQuery("countries", async () => {
    const countriesResponse = await Axios.get("/api/country/v1.0/countries");
    return countriesResponse.data;
  });

  // Prefetch brands data
  const { data: brandsData } = useQuery("brands", async () => {
    const brandsResponse = await Axios.get("/api/brands/v1.0/brands");
    return brandsResponse.data;
  });

  const handleCreateBrand = () => {
    // Navigate to the create brand page
    navigate("/brands/new");
  };

  const columns = [
    { name: "Brand Name", key: "name" },
    { name: "Brand Name ar", key: "nameAr" },
    { name: "Country Name", key: "countryName" },
    { name: "Country Name ar", key: "countryNameAr" },
  ];

  const combinedData =
    brandsData && countriesData
      ? brandsData.map((brand) => ({
          ...brand,
          countryName:
            countriesData.find((country) => country.guid === brand.countryGuid)
              ?.name || "",
          countryNameAr:
            countriesData.find((country) => country.guid === brand.countryGuid)
              ?.nameAr || "",
        }))
      : [];

  return (
    <div className="py-10">
      <StaticDataTable
        title="Brands Table"
        createBtnLabel=""
        createBtnUrl="/brands/new"
        onCreateBtnClick={handleCreateBrand}
        data={combinedData}
        columns={columns}
        tableClasses="my-custom-table-class"
        headerClasses="my-custom-header-class"
        rowClasses="my-custom-row-class"
      />
    </div>
  );
};

export default BrandsList;

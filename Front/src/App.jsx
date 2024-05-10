import React from "react";
// import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import { StepperProvider } from "./components/Drugs/StepperContext";
import { Routes, Route, Outlet } from "react-router-dom";
import {
  ErrorComponent,
  AuthPage,
  ThemedTitleV2,
} from "@refinedev/mui";
import {
  Home,
  Search,
  Dashboard,
  Add,
  Inspect,
  TrackRecords,
} from "./pages";
import { RootStoreProvider } from "./store-models";
import Header from "./components/Header/Header";
import Layout from "./components/Layout";
import { InspectionProvider } from "./pages/Inspection/InspectionContext.jsx";
import { PricesComparisonProvider } from "./Contexts/PricesComparisonContext";
import { DrugSearchProvider } from "./Contexts/DrugSearchContext.jsx";
// import { InspectionProvider } from "./Contexts/InspectionContext.jsx";
import { DrugImageProvider } from "./Contexts/DrugImagesContext.jsx";
import { DrugDocumentsProvider } from "./Contexts/DrugDocumentsContext.jsx";
import { SidebarProvider } from "./Contexts/SidebarsContext.jsx";
import TrackingProvider from "./Contexts/TrackingProvider";
import { Authenticated } from "@refinedev/core";
// import RFITable from "./components/importation/tables/RFI-Table";
import { RFICreate, RFIEdit, RFIList, RFIShow } from "./pages/Importations";

import {
  NavigateToResource,
} from "@refinedev/react-router-v6";
import { DrugOrderProvider } from "./Contexts/DrugOrderContext.jsx";
import { RFIProvider } from "./Contexts/RFIProvider";
import Importation from "./pages/orders/Import.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-svh pb-[70px] bg-white-bg dark:bg-black-bg overflow-hidden">
        <RootStoreProvider>
          <SidebarProvider>
            <StepperProvider>
              <PricesComparisonProvider>
                <DrugDocumentsProvider>
                  <DrugImageProvider>
                    <DrugSearchProvider>
                      <InspectionProvider>
                        <TrackingProvider>
                          <div className="flex w-full">
                            <Header />
                          </div>
                          <Layout>
                            <RFIProvider>
                              <DrugOrderProvider>
                                <Routes>
                                  <Route index element={<Home />} />
                                  <Route path="search" element={<Search />} />
                                  <Route
                                    path="dashboard"
                                    element={<Dashboard />}
                                  />

                                  <Route path="add" element={<Add />} />
                                  <Route
                                    path="import"
                                    element={<Importation />}
                                  />
                                  <Route path="inspect" element={<Inspect />} />
                                  <Route
                                    path="track-records"
                                    element={<TrackRecords />}
                                  />

                                  <Route path="/rfi">
                                    <Route index element={<RFIList />} />
                                    <Route
                                      path="create"
                                      element={<RFICreate />}
                                    />
                                    <Route
                                      path="edit/:id"
                                      element={<RFIEdit />}
                                    />
                                    <Route
                                      path="show/:id"
                                      element={<RFIShow />}
                                    />
                                  </Route>

                                  <Route
                                    path="*"
                                    element={<ErrorComponent />}
                                  />

                                  <Route
                                    element={
                                      <Authenticated
                                        key="authenticated-outer"
                                        fallback={<Outlet />}
                                      >
                                        <NavigateToResource />
                                      </Authenticated>
                                    }
                                  >
                                    <Route
                                      path="/login"
                                      element={
                                        <AuthPage
                                          type="login"
                                          title={
                                            <ThemedTitleV2
                                              collapsed={false}
                                              text="Refine Crud Table"
                                            />
                                          }
                                          formProps={{
                                            defaultValues: {
                                              email: "khoder.dev@gmail",
                                              password: "refine-supabase",
                                            },
                                          }}
                                        />
                                      }
                                    />
                                    <Route
                                      path="/register"
                                      element={<AuthPage type="register" />}
                                    />
                                    <Route
                                      path="/forgot-password"
                                      element={
                                        <AuthPage type="forgotPassword" />
                                      }
                                    />
                                  </Route>
                                </Routes>
                              </DrugOrderProvider>
                            </RFIProvider>
                          </Layout>
                          {/* </Refine> */}
                        </TrackingProvider>
                      </InspectionProvider>
                    </DrugSearchProvider>
                  </DrugImageProvider>
                </DrugDocumentsProvider>
              </PricesComparisonProvider>
            </StepperProvider>
          </SidebarProvider>
        </RootStoreProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;

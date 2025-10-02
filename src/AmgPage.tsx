import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header, { MenuItemType } from "./views/layout/Header";
import Footer from "./views/layout/Footer";
import Home from "./views/pages/home";
import AuthPage from "./views/pages/AuthPage";
import PiaPage from "./views/pages/pia";
import PlanDetail from "./views/pages/Plandetail";
import AMGTPage from "./views/pages/amgt";

const lazyComponentsMap: { [path: string]: React.LazyExoticComponent<React.FC> } = {};
const getLazyComponent = (path: string) => {
  if (!lazyComponentsMap[path]) {
    lazyComponentsMap[path] = React.lazy(() =>
      import(/* @vite-ignore */ `./views/pages/${path}`).catch(() =>
        Promise.resolve({ default: () => <p>Page not implemented</p> })
      )
    );
  }
  return lazyComponentsMap[path];
};

const flattenMenuItems = (items: MenuItemType[]): MenuItemType[] =>
  items.reduce<MenuItemType[]>((acc, item) => {
    if (item.children) acc.push(...flattenMenuItems(item.children));
    if (item.MenuPath) acc.push(item);
    return acc;
  }, []);

const AmgPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  // const [showPia, setShowPia] = useState(false);

  const allMenuRoutes = flattenMenuItems(menuItems);

  return (
    <Router>
      <Header
        token={token}
        setToken={setToken}
        username={username}
        setUsername={setUsername}
        setMenuItems={setMenuItems}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            token ? (
              <Navigate to="/pia" replace />
            ) : (
              <AuthPage
                setToken={setToken}
                setUsername={setUsername}
                // showPiaSetter={setShowPia}
              />
            )
          }
        />
        <Route
          path="/pia"
          element={token ? <PiaPage /> : <Navigate to="/auth" replace />}
        />
        {allMenuRoutes.map((item) => {
          const LazyComponent = getLazyComponent(item.MenuPath!.replace(/^\//, ""));
          return (
            <Route
              key={item.MenuPath}
              path={item.MenuPath}
              element={
                <React.Suspense fallback={<p>Loading {item.label}...</p>}>
                  <LazyComponent />
                </React.Suspense>
              }
            />
          );
        })}

        <Route path="/Plandetail" element={<PlanDetail />} />
        <Route path="/amgt" element={<AMGTPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AmgPage;

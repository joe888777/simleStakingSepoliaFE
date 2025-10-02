import React, { ReactNode, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  token: string | null;
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ token, children }) => {
  const content: ReactElement = <>{children}</>;

  return token ? content : <Navigate to="/auth" replace />;
};

export default PrivateRoute;




import { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../states/context/AuthContext/AuthContext";
interface PrivateRouteProps {
  children: ReactNode;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuth } = useContext(AuthContext);

  if (!isAuth) return <Navigate to={"/login"} />;
  return <>{children}</>;
};

export default PrivateRoute;

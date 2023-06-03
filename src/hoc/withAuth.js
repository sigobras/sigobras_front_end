import React from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    // Verifica la autenticación en el montaje del componente (nota: este es un ejemplo y podría ser bloqueante si la verificación es lenta)
    React.useEffect(() => {
      const isAuthenticated = Cookies.get("authToken");
      if (!isAuthenticated) {
        router.push("/");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;

import { ReactNode, createContext, useEffect, useState } from "react";

interface WindowWidthContextType {
  windowWidth: number;
}

export const WindowWidthContext = createContext<WindowWidthContextType>({
  windowWidth: 0,
});

interface ContextProviderType {
  children: ReactNode;
}

export const WindowWidthContextProvider: React.FC<ContextProviderType> = ({
  children,
}: ContextProviderType) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    function updateWindowWidth() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWindowWidth);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);
  return (
    <WindowWidthContext.Provider value={{ windowWidth }}>
      {children}
    </WindowWidthContext.Provider>
  );
};

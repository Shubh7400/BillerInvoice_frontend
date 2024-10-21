import { ReactNode, createContext, useEffect, useState } from "react";

interface ThemeContextType {
  visibility: boolean;
  updateVisibility: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  visibility: false,
  updateVisibility: () => {},
});

interface ContextProviderType {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ContextProviderType> = ({
  children,
}: ContextProviderType) => {
  const [visibility, setVisibility] = useState(false);
  const updateVisibility = () => {
    setVisibility(!visibility);
  };
  useEffect(() => {
    if (!visibility) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [visibility]);

  useEffect(() => {
    const mediaQList = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQList.matches) {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ visibility, updateVisibility }}>
      {children}
    </ThemeContext.Provider>
  );
};

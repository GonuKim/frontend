import React, { createContext, ReactNode, useState } from "react";

interface DataState {
  parsedExcelData: {
    gana: string[];
    kanji: string[];
    meaning: string[];
  };
  OCRData: {
    kanji: string[];
    gana: string[];
    meaning: string[];
  };
}

interface DataProviderProps {
  children: ReactNode;
}

export const DataContext = createContext<
  | {
      parsedExcelData: DataState["parsedExcelData"];
      setParsedExcelData: React.Dispatch<
        React.SetStateAction<DataState["parsedExcelData"]>
      >;
      OCRData: DataState["OCRData"];
      setOCRData: React.Dispatch<React.SetStateAction<DataState["OCRData"]>>;
    }
  | undefined
>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [parsedExcelData, setParsedExcelData] = useState<
    DataState["parsedExcelData"]
  >({
    gana: [],
    kanji: [],
    meaning: [],
  });

  const [OCRData, setOCRData] = useState<DataState["OCRData"]>({
    kanji: [],
    gana: [],
    meaning: [],
  });

  return (
    <DataContext.Provider
      value={{ parsedExcelData, setParsedExcelData, OCRData, setOCRData }}
    >
      {children}
    </DataContext.Provider>
  );
};

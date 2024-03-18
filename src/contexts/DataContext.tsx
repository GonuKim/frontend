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
      clearParsedExcelData: () => void; // 새로 추가된 초기화 함수
      OCRData: DataState["OCRData"];
      setOCRData: React.Dispatch<React.SetStateAction<DataState["OCRData"]>>;
      clearOCRData: () => void; // 새로 추가된 초기화 함수
    }
  | undefined
>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [parsedExcelData, setParsedExcelData] = useState<
    DataState["parsedExcelData"]
  >({ gana: [], kanji: [], meaning: [] });
  const [OCRData, setOCRData] = useState<DataState["OCRData"]>({
    kanji: [],
    gana: [],
    meaning: [],
  });

  const clearParsedExcelData = () =>
    setParsedExcelData({ gana: [], kanji: [], meaning: [] });
  const clearOCRData = () => setOCRData({ kanji: [], gana: [], meaning: [] });

  return (
    <DataContext.Provider
      value={{
        parsedExcelData,
        setParsedExcelData,
        clearParsedExcelData,
        OCRData,
        setOCRData,
        clearOCRData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

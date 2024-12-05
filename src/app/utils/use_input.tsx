import { useEffect, useState } from "react";
import { InputPorps, loadData, syncLocalStorageToIndexedDB } from "../page";
import { addData, saveToLocalStorage } from "./indexeddb";

const useInput = ({ isOnline }: { isOnline: boolean }) => {
  const [input, setInput] = useState("");
  const [savedData, setSavedData] = useState<InputPorps[]>([]);
  const handleSave = () => {
    if (!input) return;
    const newData = { value: input, timestamp: new Date().toISOString() };
    if (isOnline) {
      // Save directly to IndexedDB
      addData("MyAppDB", "UserInputs", newData).then(() => {
        setSavedData((pre) => [
          ...pre,
          { ...newData, id: `${pre.length + 1}` },
        ]);
      });
    } else {
      // Save to localStorage when offline
      saveToLocalStorage("offlineData", newData);
      setSavedData((pre) => [...pre, { ...newData, id: `${pre.length + 1}` }]);
    }
    setInput("");
  };

  /**
   * This Hook is used to sync the indexed db and localstorage
   */

  useEffect(() => {
    if (isOnline) {
      syncLocalStorageToIndexedDB();
      loadData(setSavedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  /**
   * This hook fetches the data from Indexed DB and accept a function to pass the data to it
   */
  useEffect(() => {
    loadData(setSavedData);
  }, []);

  return { input, savedData, handleSave, setInput };
};

export default useInput;

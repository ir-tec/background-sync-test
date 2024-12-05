"use client";

import { addData, getData } from "./utils/indexeddb";
import { getFromLocalStorage, clearLocalStorage } from "./utils/indexeddb";
import { useServiceWorker } from "./utils/register_service_worlker";
import useOnlineStatus from "./utils/use_navigator_online";
import useInput from "./utils/use_input";
export type InputPorps = {
  id?: string;
  value: string;
  timestamp: Date | string;
};
export default function Home() {
  useServiceWorker();
  const { isOnline, message } = useOnlineStatus();
  const { handleSave, input, savedData, setInput } = useInput({ isOnline });
  return (
    <div style={{ padding: "20px" }}>
      <h1 className="mb-8 text-2xl">Kala Bazar Test</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter something..."
        style={{ padding: "10px", width: "200px", color: "black" }}
      />
      <button
        onClick={handleSave}
        style={{ padding: "10px", marginLeft: "10px" }}
      >
        Save
      </button>
      <p>{message}</p>
      <ul className="mt-4">
        {savedData.map((item, index) => (
          <li key={index}>
            {item.value} (saved at {new Date(item.timestamp).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export const loadData = async (set_data: (data: InputPorps[]) => void) => {
  try {
    const data = await getData("MyAppDB", "UserInputs");
    set_data?.(data);
  } catch (error) {
    console.log({ error });
  }
};
export const syncLocalStorageToIndexedDB = async () => {
  const offlineData = getFromLocalStorage("offlineData");

  if (offlineData?.length > 0) {
    const promises = offlineData.map((data: InputPorps) => {
      return addData("MyAppDB", "UserInputs", data);
    });
    try {
      await Promise.all(promises);
      clearLocalStorage("offlineData");
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
};

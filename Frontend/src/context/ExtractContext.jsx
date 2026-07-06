import React, { createContext, useState, useContext } from "react";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

const ExtractContext = createContext();

export function ExtractProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState([]);
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState(null);

  const extractTasks = async (text) => {
    setIsLoading(true);
    setRawText(text);
    setExtractedTasks([]);
    setError(null);

    try {
      const response = await axiosClient.post("/extract", { rawText: text });
      const { tasks } = response.data;
      setExtractedTasks(tasks);
      toast.success(`Successfully extracted ${tasks.length} tasks!`);
      return tasks;
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to extract tasks. Please try again.";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearExtraction = () => {
    setExtractedTasks([]);
    setRawText("");
    setError(null);
  };

  return (
    <ExtractContext.Provider
      value={{
        isLoading,
        extractedTasks,
        rawText,
        error,
        extractTasks,
        clearExtraction
      }}
    >
      {children}
    </ExtractContext.Provider>
  );
}

export function useExtract() {
  const context = useContext(ExtractContext);
  if (!context) {
    throw new Error("useExtract must be used within an ExtractProvider");
  }
  return context;
}

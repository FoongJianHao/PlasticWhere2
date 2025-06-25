// Import React utilities for creating context, hooks, and type definitions
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define TypeScript interface for data entries
interface DataEntry {
  imageUri: string; // URI of the image
  date: string; // Formatted date string
  location: string; // Location string (address or coordinates)
  label: string; // Label for the entry (e.g., "Plastic Waste")
  timestamp?: number; // Optional timestamp for sorting
}

// Define TypeScript interface for the context type
interface DataContextType {
  dataEntries: DataEntry[]; // Array of data entries
  setDataEntries: React.Dispatch<React.SetStateAction<DataEntry[]>>; // Function to update data entries
  isLoading: boolean; // Loading state
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // Function to update loading state
}

// Create a context with an initial undefined value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Define DataProvider component to provide the context
export function DataProvider({ children }: { children: ReactNode }) {
  // State for storing data entries, initialized as an empty array
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  // State for tracking loading status, initialized as true
  const [isLoading, setIsLoading] = useState(true);

  return (
    // Provide context values to children components
    <DataContext.Provider value={{ dataEntries, setDataEntries, isLoading, setIsLoading }}>
      {children} {/* Render child components */}
    </DataContext.Provider>
  );
}

// Define custom hook to access the context
export const useData = () => {
  // Get context value
  const context = useContext(DataContext);
  // Throw error if used outside DataProvider
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context; // Return context value
};
import React, { createContext, useContext, useState } from 'react';

const EventIdContext = createContext();

export const useEventId = () => useContext(EventIdContext);

export const EventIdProvider = ({ children }) => {
  const [eventId, setEventId] = useState(1); // Set a default eventId for testing or fetch/set dynamically

  return (
    <EventIdContext.Provider value={{ eventId, setEventId }}>
      {children}
    </EventIdContext.Provider>
  );
};
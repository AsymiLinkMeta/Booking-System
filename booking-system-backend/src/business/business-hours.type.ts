// src/business/business-hours.type.ts
export interface BusinessHours {
    [day: string]: {
      open: string;
      close: string;
    };
  }
  

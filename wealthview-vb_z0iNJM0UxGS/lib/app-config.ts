// *** Configurable variables for the app ***

export const APP_CONFIG = {
  // UPDATE: Set to the welcome message for the chatbot
  WELCOME_MESSAGE: `Welcome! 
  I'm your 24/7 financial guide, here to help you build wealth & achieve financial freedom. Let's explore financial education & investment insights to reach your goals.
  How can I help u today?`,

  // UPDATE: Set to the name of the chatbot app
  NAME: "WealthView",

  // UPDATE: Set to the description of the chatbot app
  DESCRIPTION: "Discover elite financial education & expert investment guidance—your key to building wealth and achieving true financial freedom. 24/7 personalized support for all your goals. Join now!",
};

// This is the missing piece that caused the crash!
export const COLORS = {
  PRIMARY: "#6b46c1", // A nice purple, common for Wealth/Finance apps
  SECONDARY: "#f7fafc",
  ACCENT: "#48bb78",
};

export const BACKEND_URLS = {
  API_BASE: "https://your-backend-api.com",
};

export const PI_NETWORK_CONFIG = {
  sandbox: true,
};

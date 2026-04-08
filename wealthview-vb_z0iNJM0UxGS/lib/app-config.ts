// *** Configurable variables for the app ***
// This file contains all the user-editable configuration values that can be updated when customizing the chatbot app.

export const APP_CONFIG = {
  // UPDATE: Set to the welcome message for the chatbot
  WELCOME_MESSAGE:
    "Welcome!
I'm your 24/7 financial guide, here to help you build wealth & achieve financial freedom. Let's explore financial education & investment insights to reach your goals.
How can I help u today?",

  // UPDATE: Set to the name of the chatbot app
  NAME: "WealthView ",

  // UPDATE: Set to the description of the chatbot app
  DESCRIPTION: "Discover elite financial education & expert investment guidance—your key to building wealth and achieving true financial freedom. 24/7 personalized support for all your goals. Join now!",
} as const;

// Colors Configuration - UPDATE THESE VALUES BASED ON USER DESIGN PREFERENCES
export const COLORS = {
  // UPDATE: Set to the background color (hex format)
  BACKGROUND: "#FFFFFF",

  // UPDATE: Set to the primary color for buttons, links, etc. (hex format)
  PRIMARY: "#703D92",
} as const;

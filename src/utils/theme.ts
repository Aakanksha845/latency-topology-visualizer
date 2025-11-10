/**
 * Theme utility functions for consistent styling across components
 */

export const getSecondaryButtonClasses = (isDark: boolean): string =>
  `px-3 py-1 rounded text-sm ${
    isDark
      ? "bg-gray-700 text-white hover:bg-gray-600"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
  }`;

export const getPrimaryButtonClasses = (isDark: boolean): string =>
  `w-full px-3 py-2 rounded text-sm ${
    isDark
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-blue-500 text-white hover:bg-blue-600"
  }`;

export const getPanelBgClasses = (isDark: boolean): string =>
  isDark ? "bg-gray-900" : "bg-gray-100";

export const getHeaderTextClasses = (isDark: boolean): string =>
  `text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`;

export const getLabelTextClasses = (isDark: boolean): string =>
  `block text-sm font-medium mb-2 ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

export const getInputClasses = (isDark: boolean): string =>
  `w-full px-3 py-2 rounded border ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900"
  } focus:outline-none focus:ring-2 focus:ring-blue-500`;

export const getSectionHeaderClasses = (isDark: boolean): string =>
  `text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`;

export const getListItemTextClasses = (isDark: boolean): string =>
  isDark ? "text-gray-300" : "text-gray-700";

export const getListItemHoverClasses = (isDark: boolean): string =>
  `p-2 rounded hover:bg-opacity-50 ${
    isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"
  }`;

export const getToggleLabelClasses = (isDark: boolean): string =>
  `flex items-center justify-between cursor-pointer ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

export const getCheckboxLabelClasses = (isDark: boolean): string =>
  `flex items-center cursor-pointer ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

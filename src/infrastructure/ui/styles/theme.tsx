import { createTheme } from "@mui/material";

import { colors } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: { main: colors.blue[500] },
  },
  typography: { fontSize: 14 },
  shape: { borderRadius: 6 },
  components: {
    MuiButtonBase: {
      defaultProps: { disableRipple: false },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, size: "small" },
      styleOverrides: {
        root: {
          padding: "3px 12px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 14,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        noOptions: { fontSize: 14 },
        root: {
          "& .MuiInputBase-root": { minHeight: 40 },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        multiple: {
          padding: "4px",
        },
      },
    },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: {
        root: {
          fontSize: 14,
          border: `1px solid ${colors.grey[300]}`,
          "&::before": {
            display: "none",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          margin: "6px 0",
        },
        root: {
          minHeight: 36,
          backgroundColor: colors.grey[100],
          fontSize: 14,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "20px 20px 30px 20px",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          color: colors.grey[900] + " !important",
          fontWeight: 400,
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: "Rows per page:",
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root ": { minHeight: 40 },
        },
      },
    },
    MuiSwitch: {
      defaultProps: { size: "small" },
    },
  },
});

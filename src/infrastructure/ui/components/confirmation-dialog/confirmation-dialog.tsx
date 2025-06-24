import { Check } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type ConfirmationDialogProps = {
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  loading: boolean;
  onConfirm: () => void;
  children: React.ReactNode;
  okButtonText: string;
  okButtonColor?: "primary" | "error";
  cancelButtonText: string;
};

export function ConfirmationDialog({
  title,
  isOpen,
  setIsOpen,
  loading,
  onConfirm,
  children,
  okButtonText,
  okButtonColor = "primary",
  cancelButtonText,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions className="tw-mx-3 tw-my-2">
        <Button onClick={() => setIsOpen(false)}>{cancelButtonText}</Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          color={okButtonColor}
          onClick={onConfirm}
          loadingPosition="start"
          startIcon={<Check />}
          className="tw-normal-case"
        >
          {okButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

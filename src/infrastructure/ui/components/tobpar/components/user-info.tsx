import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

function getUserInitials(user: User): React.ReactNode {
  return `${user?.firstName.slice(0, 1)}${user?.lastName.slice(0, 1)}`.toUpperCase();
}

function getCurrentTime(timezone: string): string {
  return new Date().toLocaleTimeString("en-US", { timeZone: timezone });
}
interface UserInfoProps {
  user: User | undefined;
}

export function UserInfo({ user }: UserInfoProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleMenu = (event: React.MouseEvent<HTMLElement> | null) => {
    setAnchorEl(event?.currentTarget ?? null);
  };

  return (
    <div className="tw-flex tw-items-center tw-gap-1">
      {user && (
        <>
          <div className="tw-flex-col tw-items-end sm:tw-flex">
            <div className="tw-text-xs tw-font-normal">{user.username}</div>
          </div>
          <IconButton onClick={toggleMenu}>
            <Avatar sx={{ bgcolor: "primary.dark" }}>{getUserInitials(user)}</Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={() => toggleMenu(null)}
            slotProps={{
              paper: { style: { width: "300px" } },
            }}
          >
            <MenuItem disableRipple>
              <div className="tw-flex tw-flex-col tw-text-sm">
                {user ? (
                  <>
                    <div className="tw-font-medium">{`${user.firstName} ${user.lastName}`}</div>
                    <div className="tw-text-gray-500">{user.email}</div>
                    <div className="tw-flex tw-items-center tw-gap-1 tw-text-gray-500">
                      {getCurrentTime(user.timezone)}
                      <span className="tw-text-xs tw-font-normal"> ({user.timezone})</span>
                    </div>
                  </>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </MenuItem>

            {/* <Divider /><MenuItem onClick={onLogout}>
                <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm">
                  <LogoutOutlined fontSize="small" />
                  <div>Logout</div>
                </div>
              </MenuItem> */}
          </Menu>
        </>
      )}
    </div>
  );
}

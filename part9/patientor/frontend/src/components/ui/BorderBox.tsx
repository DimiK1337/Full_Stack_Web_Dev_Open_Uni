
import { 
  Box, 
  BoxProps 
} from "@mui/material";
import { ReactNode } from "react";

interface BorderBoxProps extends BoxProps {
  children: ReactNode;
}

const BorderBox: React.FC<BorderBoxProps> = ({ children, ...rest }) => {
  return (
    <Box border="1px solid gray" borderRadius={2} p={2} m={2} {...rest}>
      {children}
    </Box>
  );
};

export default BorderBox;

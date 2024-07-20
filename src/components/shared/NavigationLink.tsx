import { Link } from "react-router-dom"
import { Box } from "@mui/material";
type Props={
    to:string;
    bg:string;
    text:string;
    textColor:string;
    onclick?:()=>Promise<void>;
};


const NavigationLink = (props: Props) => {
  return (
    <Box
      component={Link}
      onClick={props.onclick}
      to={props.to}
      sx={{
        display: "inline-block",
        background: props.bg,
        color: props.textColor,
        padding: { xs: "8px 12px", md: "10px 20px" },
        fontSize: { xs: "12px", md: "16px" },
        borderRadius: "4px",
        textAlign: "center",
        marginLeft:"20px",
        textDecoration: "none",
        fontWeight: "bold",
        "&:hover": {
          background: "darken",
        },
      }}
    >
      {props.text}
    </Box>
  );
};

export default NavigationLink
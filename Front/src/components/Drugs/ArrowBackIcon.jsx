import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const styles = (theme) => ({
  arrowBack: {
    color: "blue", // Set the default color
    transition: "color 0.3s", // Transition the color change on hover
    "&:hover": {
      color: "red", // Change the color to red on hover
    },
  },
});

export default withStyles(styles)(ArrowBackIcon);

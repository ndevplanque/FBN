import Stack from '@mui/material/Stack';
import Avatar from "@mui/material/Avatar";

import './Header.css';

const Header = () => {
  const imgUrl = "https://www.causeur.fr/wp-content/uploads/2018/03/emmanuel-macron-classes-moyennes-768x466.jpg";
  const imgSize = 50;
  const name = "M'sieur Macron";
  return (
    <>
      <header>
        <Stack className="Stack" direction="row" spacing={3} justifyContent="center" alignItems="center">
          <AvatarName name={name} />
          {/* <Avatar alt="Macron" src={imgUrl} sx={{ width: imgSize, height: imgSize }} /> */}
        </Stack>
      </header>
    </>
  )
}

export default Header;


const AvatarName = (props) => { return <span>{props.name}</span> };

import { BsCode, BsEmojiSunglasses } from 'react-icons/bs';
import { GiCakeSlice, GiGalaxy, GiLipstick, GiFilmSpool, GiPhotoCamera } from 'react-icons/gi';
import { FaPaw, FaMedal, FaGamepad } from 'react-icons/fa';
import { TbMist } from 'react-icons/tb';
import { MdOutlineSportsVolleyball, MdCastForEducation } from 'react-icons/md';

export const topics = [
  {
    name: 'photography',
    icon: <GiPhotoCamera />,
  },
  {
    name: 'beauty',
    icon: <GiLipstick />,
  },
  {
    name: 'dance',
    icon: <GiGalaxy />,
  },
  {
    name: 'gaming',
    icon: <FaGamepad />,
  },
  {
    name: 'food',
    icon: <GiCakeSlice />,
  },
  {
    name: 'comedy',
    icon: <BsEmojiSunglasses />,
  },
  {
    name: 'movie',
    icon: <GiFilmSpool />,
  },
  {
    name: 'animals',
    icon: <FaPaw />,
  },
  {
    name: 'sports',
    icon: <MdOutlineSportsVolleyball />,
  },
  {
    name: 'studies',
    icon: <MdCastForEducation />,
  },
  {
    name: 'others',
    icon: <TbMist />,
  },
];

export const footerList1 = ['About', 'Newsroom', 'Store', 'Contact', 'Carrers', 'ByteDance', 'Creator Directory']
export const footerList2 = [ 'Clang for Good','Advertise','Developers','Transparency','Clang Rewards' ]
export const footerList3 = [ 'Help', 'Safety', 'Terms', 'Privacy', 'Creator Portal', 'Community Guidelines' ]